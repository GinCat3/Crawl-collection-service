create table collection (
    id bigserial primary key,
    collection_symbol varchar(32) not null,
    collection_name varchar(64) not null,
    collection_desc text not null default '',
    total_supply bigint not null default 0,
    range_start bigint not null default 0,
    range_end bigint not null default 0,
    cover_img text not null default '',
    created_at timestamp not null default now(),
    updated_at timestamp not null default now(),
);

create unique index collection_collection_symbol_uniq_index on collection (collection_symbol);

create table collection_token (
    id bigserial primary key,
    collection_id bigint not null,
    name varchar(64) not null,
    inscription_id varchar(128) not null,
    me_inscription_number bigint not null,
    genesis_transaction_hash varchar(128) not null,
    genesis_block_hash varchar(128) not null,
    genesis_block_time timestamp not null,
    genesis_block_height bigint not null,
    "owner" varchar(128) not null,
    sat bigint not null,
    sat_rarity varchar(32) not null,
    sat_block_height bigint not null,
    sat_block_time timestamp not null,
    created_at timestamp not null default now(),
    updated_at timestamp not null default now(),
);

create table sync_state (
    id bigserial primary key,
    collection_id bigint not null,
    offset bigint not null,
    error_message text not null default '',
    created_at timestamp not null default now(),
    updated_at timestamp not null default now(),
);
