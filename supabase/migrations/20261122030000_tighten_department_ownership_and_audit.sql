alter table private.agent_tasks add constraint agent_tasks_id_user_unique unique (id,user_id);
alter table private.agent_runs add constraint agent_runs_id_user_unique unique (id,user_id);
alter table private.agent_profiles add constraint agent_profiles_id_user_unique unique (id,user_id);

alter table private.agent_tasks
  add constraint agent_tasks_parent_same_owner_fk
  foreign key (parent_task_id,user_id)
  references private.agent_tasks(id,user_id);

alter table private.agent_tasks
  add constraint agent_tasks_agent_same_owner_fk
  foreign key (assigned_agent_id,user_id)
  references private.agent_profiles(id,user_id);

alter table private.agent_runs
  add constraint agent_runs_task_same_owner_fk
  foreign key (task_id,user_id)
  references private.agent_tasks(id,user_id)
  on delete cascade;

alter table private.agent_runs
  add constraint agent_runs_agent_same_owner_fk
  foreign key (agent_id,user_id)
  references private.agent_profiles(id,user_id);

alter table private.agent_messages
  add constraint agent_messages_task_same_owner_fk
  foreign key (task_id,user_id)
  references private.agent_tasks(id,user_id)
  on delete cascade;

alter table private.agent_messages
  add constraint agent_messages_run_same_owner_fk
  foreign key (run_id,user_id)
  references private.agent_runs(id,user_id);

alter table private.review_decisions
  add constraint review_decisions_task_same_owner_fk
  foreign key (task_id,user_id)
  references private.agent_tasks(id,user_id)
  on delete cascade;

alter table private.founder_decisions
  add constraint founder_decisions_task_same_owner_fk
  foreign key (task_id,user_id)
  references private.agent_tasks(id,user_id);

alter table private.department_events
  add constraint department_events_task_same_owner_fk
  foreign key (task_id,user_id)
  references private.agent_tasks(id,user_id);

drop policy founder_owns_agent_messages on private.agent_messages;
create policy agent_messages_read_own on private.agent_messages
  for select to authenticated using ((select auth.uid()) = user_id);
create policy agent_messages_insert_own on private.agent_messages
  for insert to authenticated with check ((select auth.uid()) = user_id);
revoke update, delete on private.agent_messages from authenticated;

drop policy founder_owns_review_decisions on private.review_decisions;
create policy review_decisions_read_own on private.review_decisions
  for select to authenticated using ((select auth.uid()) = user_id);
create policy review_decisions_insert_own on private.review_decisions
  for insert to authenticated with check ((select auth.uid()) = user_id);
revoke update, delete on private.review_decisions from authenticated;

drop policy founder_owns_founder_decisions on private.founder_decisions;
create policy founder_decisions_read_own on private.founder_decisions
  for select to authenticated using ((select auth.uid()) = user_id);
create policy founder_decisions_insert_own on private.founder_decisions
  for insert to authenticated with check ((select auth.uid()) = user_id);
revoke update, delete on private.founder_decisions from authenticated;

drop policy founder_owns_department_events on private.department_events;
create policy department_events_read_own on private.department_events
  for select to authenticated using ((select auth.uid()) = user_id);
create policy department_events_insert_own on private.department_events
  for insert to authenticated with check ((select auth.uid()) = user_id);
revoke update, delete on private.department_events from authenticated;
