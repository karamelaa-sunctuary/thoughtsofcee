create or replace function public.studio_memory_list(p_status text default null)
returns jsonb language sql stable security invoker set search_path = ''
as $$
  select coalesce(jsonb_agg(to_jsonb(m) order by m.updated_at desc), '[]'::jsonb)
  from private.department_memory m
  where m.user_id = (select auth.uid())
    and (p_status is null or m.status = p_status);
$$;

create or replace function public.studio_memory_create(
  p_memory_type text, p_title text, p_content text,
  p_source_ref text default null, p_provenance text default null
)
returns uuid language plpgsql security invoker set search_path = ''
as $$
declare v_id uuid;
begin
  if (select auth.uid()) is null then
    raise exception 'Founder authentication required' using errcode = '28000';
  end if;
  insert into private.department_memory
    (user_id,memory_type,title,content,source_ref,provenance,created_by)
  values
    ((select auth.uid()),p_memory_type,p_title,p_content,p_source_ref,p_provenance,(select auth.uid()))
  returning id into v_id;
  insert into private.department_events(user_id,event_type,actor_type,actor_id,entity_type,entity_id,details)
  values ((select auth.uid()),'memory.created','founder','founder','memory',v_id::text,jsonb_build_object('memory_type',p_memory_type,'status','draft'));
  return v_id;
end;
$$;

create or replace function public.studio_memory_approve(p_id uuid)
returns boolean language plpgsql security invoker set search_path = ''
as $$
declare v_count integer;
begin
  if (select auth.uid()) is null then
    raise exception 'Founder authentication required' using errcode = '28000';
  end if;
  update private.department_memory
  set status='approved',trust_class='founder_approved',
      reviewed_by=(select auth.uid()),reviewed_at=now(),updated_at=now()
  where id=p_id and user_id=(select auth.uid()) and status in ('draft','pending_review');
  get diagnostics v_count = row_count;
  if v_count=1 then
    insert into private.department_events(user_id,event_type,actor_type,actor_id,entity_type,entity_id,details)
    values ((select auth.uid()),'memory.approved','founder','founder','memory',p_id::text,'{}'::jsonb);
  end if;
  return v_count=1;
end;
$$;

create or replace function public.studio_instruction_list(p_scope text default null)
returns jsonb language sql stable security invoker set search_path = ''
as $$
  select coalesce(jsonb_agg(to_jsonb(i) order by i.updated_at desc), '[]'::jsonb)
  from private.department_instructions i
  where i.user_id=(select auth.uid()) and (p_scope is null or i.scope=p_scope);
$$;

create or replace function public.studio_instruction_create(p_scope text,p_scope_ref text,p_title text,p_content text)
returns uuid language plpgsql security invoker set search_path = ''
as $$
declare v_id uuid;
begin
  if (select auth.uid()) is null then
    raise exception 'Founder authentication required' using errcode = '28000';
  end if;
  insert into private.department_instructions(user_id,scope,scope_ref,title,content,created_by)
  values ((select auth.uid()),p_scope,p_scope_ref,p_title,p_content,(select auth.uid()))
  returning id into v_id;
  insert into private.department_events(user_id,event_type,actor_type,actor_id,entity_type,entity_id,details)
  values ((select auth.uid()),'instruction.created','founder','founder','instruction',v_id::text,jsonb_build_object('scope',p_scope,'status','draft'));
  return v_id;
end;
$$;

create or replace function public.studio_instruction_approve(p_id uuid)
returns boolean language plpgsql security invoker set search_path = ''
as $$
declare v_count integer;
begin
  if (select auth.uid()) is null then
    raise exception 'Founder authentication required' using errcode = '28000';
  end if;
  update private.department_instructions
  set status='approved',approved_by=(select auth.uid()),approved_at=now(),updated_at=now()
  where id=p_id and user_id=(select auth.uid()) and status in ('draft','pending_review');
  get diagnostics v_count = row_count;
  if v_count=1 then
    insert into private.department_events(user_id,event_type,actor_type,actor_id,entity_type,entity_id,details)
    values ((select auth.uid()),'instruction.approved','founder','founder','instruction',p_id::text,'{}'::jsonb);
  end if;
  return v_count=1;
end;
$$;

create or replace function public.studio_task_list(p_status text default null)
returns jsonb language sql stable security invoker set search_path = ''
as $$
  select coalesce(jsonb_agg(to_jsonb(t) order by t.updated_at desc), '[]'::jsonb)
  from private.agent_tasks t
  where t.user_id=(select auth.uid()) and (p_status is null or t.status=p_status);
$$;

create or replace function public.studio_task_create(p_title text,p_objective text,p_priority text default 'normal',p_acceptance_criteria jsonb default '[]'::jsonb)
returns uuid language plpgsql security invoker set search_path = ''
as $$
declare v_id uuid;
begin
  if (select auth.uid()) is null then
    raise exception 'Founder authentication required' using errcode = '28000';
  end if;
  insert into private.agent_tasks(user_id,title,objective,priority,acceptance_criteria,created_by)
  values ((select auth.uid()),p_title,p_objective,p_priority,coalesce(p_acceptance_criteria,'[]'::jsonb),(select auth.uid()))
  returning id into v_id;
  insert into private.department_events(user_id,event_type,actor_type,actor_id,task_id,entity_type,entity_id,details)
  values ((select auth.uid()),'task.created','founder','founder',v_id,'task',v_id::text,jsonb_build_object('status','draft'));
  return v_id;
end;
$$;

create or replace function public.studio_task_decide(p_task_id uuid,p_decision text,p_rationale text default null)
returns uuid language plpgsql security invoker set search_path = ''
as $$
declare v_id uuid; v_status text;
begin
  if (select auth.uid()) is null then
    raise exception 'Founder authentication required' using errcode = '28000';
  end if;
  if p_decision not in ('approved','rejected','changes_requested','deferred') then
    raise exception 'Invalid founder decision' using errcode = '22023';
  end if;
  v_status := case p_decision
    when 'approved' then 'approved'
    when 'rejected' then 'rejected'
    when 'changes_requested' then 'changes_requested'
    else 'awaiting_founder'
  end;
  update private.agent_tasks set status=v_status,updated_at=now()
  where id=p_task_id and user_id=(select auth.uid()) and status in ('review','awaiting_founder');
  if not found then
    raise exception 'Task not found or not awaiting founder decision' using errcode = 'P0002';
  end if;
  insert into private.founder_decisions(user_id,task_id,decision,rationale,decided_by)
  values ((select auth.uid()),p_task_id,p_decision,p_rationale,(select auth.uid()))
  returning id into v_id;
  insert into private.department_events(user_id,event_type,actor_type,actor_id,task_id,entity_type,entity_id,details)
  values ((select auth.uid()),'task.founder_decision','founder','founder',p_task_id,'founder_decision',v_id::text,jsonb_build_object('decision',p_decision));
  return v_id;
end;
$$;

revoke all on function public.studio_memory_list(text) from public,anon;
revoke all on function public.studio_memory_create(text,text,text,text,text) from public,anon;
revoke all on function public.studio_memory_approve(uuid) from public,anon;
revoke all on function public.studio_instruction_list(text) from public,anon;
revoke all on function public.studio_instruction_create(text,text,text,text) from public,anon;
revoke all on function public.studio_instruction_approve(uuid) from public,anon;
revoke all on function public.studio_task_list(text) from public,anon;
revoke all on function public.studio_task_create(text,text,text,jsonb) from public,anon;
revoke all on function public.studio_task_decide(uuid,text,text) from public,anon;

grant execute on function public.studio_memory_list(text) to authenticated;
grant execute on function public.studio_memory_create(text,text,text,text,text) to authenticated;
grant execute on function public.studio_memory_approve(uuid) to authenticated;
grant execute on function public.studio_instruction_list(text) to authenticated;
grant execute on function public.studio_instruction_create(text,text,text,text) to authenticated;
grant execute on function public.studio_instruction_approve(uuid) to authenticated;
grant execute on function public.studio_task_list(text) to authenticated;
grant execute on function public.studio_task_create(text,text,text,jsonb) to authenticated;
grant execute on function public.studio_task_decide(uuid,text,text) to authenticated;
