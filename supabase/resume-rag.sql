create extension if not exists vector with schema extensions;

create table if not exists public.portfolio_resume_chunks (
  id bigserial primary key,
  content text not null,
  section text not null default 'Resume',
  source text not null default 'resume',
  source_url text not null default 'app/rag/resume.md',
  chunk_index integer not null,
  content_hash text not null unique,
  embedding extensions.vector(1024) not null,
  updated_at timestamptz not null default now()
);

alter table public.portfolio_resume_chunks enable row level security;

create or replace function public.match_resume_chunks(
  query_embedding extensions.vector(1024),
  match_threshold float default 0.4,
  match_count int default 5
)
returns table (
  id bigint,
  content text,
  section text,
  source_url text,
  similarity float
)
language plpgsql
stable
as $$
begin
  return query
  select
    portfolio_resume_chunks.id,
    portfolio_resume_chunks.content,
    portfolio_resume_chunks.section,
    portfolio_resume_chunks.source_url,
    1 - (portfolio_resume_chunks.embedding <=> query_embedding) as similarity
  from public.portfolio_resume_chunks
  where 1 - (portfolio_resume_chunks.embedding <=> query_embedding) > match_threshold
  order by portfolio_resume_chunks.embedding <=> query_embedding
  limit match_count;
end;
$$;

revoke all on public.portfolio_resume_chunks from anon, authenticated;
revoke execute on function public.match_resume_chunks(extensions.vector, float, int) from anon, authenticated;

grant usage on schema public to service_role;
grant all on public.portfolio_resume_chunks to service_role;
grant usage, select on sequence public.portfolio_resume_chunks_id_seq to service_role;
grant execute on function public.match_resume_chunks(extensions.vector, float, int) to service_role;
