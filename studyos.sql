create table courses
(
    id          bigint unsigned auto_increment
        primary key,
    created_at  datetime(3)  null,
    updated_at  datetime(3)  null,
    deleted_at  datetime(3)  null,
    title       varchar(255) null,
    description text         null
);

create table chapters
(
    id         bigint unsigned auto_increment
        primary key,
    created_at datetime(3)     null,
    updated_at datetime(3)     null,
    deleted_at datetime(3)     null,
    course_id  bigint unsigned null,
    title      varchar(255)    null,
    constraint fk_courses_chapters
        foreign key (course_id) references courses (id)
);

create index idx_chapters_course_id
    on chapters (course_id);

create index idx_chapters_deleted_at
    on chapters (deleted_at);

create table course_references
(
    id             bigint unsigned auto_increment
        primary key,
    created_at     datetime(3)     null,
    updated_at     datetime(3)     null,
    deleted_at     datetime(3)     null,
    course_id      bigint unsigned null,
    title          varchar(255)    null,
    author         varchar(255)    null,
    reference_type varchar(50)     null,
    constraint fk_course_references_course
        foreign key (course_id) references courses (id)
);

create index idx_course_references_deleted_at
    on course_references (deleted_at);

create table sections
(
    id               bigint unsigned auto_increment
        primary key,
    created_at       datetime(3)     null,
    updated_at       datetime(3)     null,
    deleted_at       datetime(3)     null,
    chapter_id       bigint unsigned null,
    title            varchar(255)    null,
    task_description varchar(1023)   null,
    container_info   text            null,
    constraint fk_chapters_sections
        foreign key (chapter_id) references chapters (id)
);

create table section_images
(
    id          bigint unsigned auto_increment
        primary key,
    created_at  datetime(3)     null,
    updated_at  datetime(3)     null,
    deleted_at  datetime(3)     null,
    section_id  bigint unsigned not null,
    image_name  varchar(255)    null,
    tag         varchar(100)    null,
    description text            null,
    constraint fk_section_images_section
        foreign key (section_id) references sections (id)
);

create table section_check_scripts
(
    id           bigint unsigned auto_increment
        primary key,
    created_at   datetime(3)     null,
    updated_at   datetime(3)     null,
    deleted_at   datetime(3)     null,
    image_id     bigint unsigned not null,
    script_type  varchar(50)     null,
    script_body  text            null,
    success_hint varchar(255)    null,
    constraint fk_check_scripts_image
        foreign key (image_id) references section_images (id)
);

create table section_image_limits
(
    id         bigint unsigned auto_increment
        primary key,
    created_at datetime(3)     null,
    updated_at datetime(3)     null,
    deleted_at datetime(3)     null,
    image_id   bigint unsigned not null,
    cpu_min    varchar(50)     null,
    memory_min varchar(50)     null,
    cpu_max    varchar(50)     null,
    memory_max varchar(50)     null,
    constraint fk_limits_image
        foreign key (image_id) references section_images (id)
);

create table section_image_mounts
(
    id             bigint unsigned auto_increment
        primary key,
    created_at     datetime(3)          null,
    updated_at     datetime(3)          null,
    deleted_at     datetime(3)          null,
    image_id       bigint unsigned      not null,
    host_path      varchar(255)         null,
    container_path varchar(255)         null,
    read_only      tinyint(1) default 0 null,
    constraint fk_mounts_image
        foreign key (image_id) references section_images (id)
);

create table section_image_ports
(
    id             bigint unsigned auto_increment
        primary key,
    created_at     datetime(3)               null,
    updated_at     datetime(3)               null,
    deleted_at     datetime(3)               null,
    image_id       bigint unsigned           not null,
    container_port int                       null,
    host_port      int                       null,
    protocol       varchar(10) default 'tcp' null,
    constraint fk_ports_image
        foreign key (image_id) references section_images (id)
);

create index idx_sections_chapter_id
    on sections (chapter_id);

create index idx_sections_deleted_at
    on sections (deleted_at);

create table users
(
    id         bigint unsigned auto_increment
        primary key,
    created_at datetime(3)  null,
    updated_at datetime(3)  null,
    deleted_at datetime(3)  null,
    name       varchar(255) null,
    avatar_url varchar(255) null,
    phone      varchar(20)  null,
    email      varchar(100) null
);

create table containers
(
    id           bigint unsigned auto_increment
        primary key,
    created_at   datetime(3)     null,
    updated_at   datetime(3)     null,
    deleted_at   datetime(3)     null,
    user_id      bigint unsigned not null,
    image_id     bigint unsigned not null,
    container_id varchar(255)    null,
    ip_address   varchar(50)     null,
    status       varchar(50)     null,
    started_at   datetime(3)     null,
    stopped_at   datetime(3)     null,
    log_path     text            null,
    constraint fk_containers_image
        foreign key (image_id) references section_images (id),
    constraint fk_containers_user
        foreign key (user_id) references users (id)
);

create table experiment_runs
(
    id           bigint unsigned auto_increment
        primary key,
    created_at   datetime(3)     null,
    updated_at   datetime(3)     null,
    deleted_at   datetime(3)     null,
    user_id      bigint unsigned not null,
    section_id   bigint unsigned not null,
    container_id varchar(255)    null,
    start_time   datetime(3)     null,
    end_time     datetime(3)     null,
    status       varchar(50)     null,
    user_output  text            null,
    check_result varchar(255)    null,
    constraint fk_runs_section
        foreign key (section_id) references sections (id),
    constraint fk_runs_user
        foreign key (user_id) references users (id)
);

create index idx_experiment_runs_section_id
    on experiment_runs (section_id);

create index idx_experiment_runs_user_id
    on experiment_runs (user_id);

create table user_reference_reads
(
    id           bigint unsigned auto_increment
        primary key,
    created_at   datetime(3)     null,
    updated_at   datetime(3)     null,
    deleted_at   datetime(3)     null,
    user_id      bigint unsigned null,
    reference_id bigint unsigned null,
    has_read     tinyint(1)      null,
    constraint fk_reads_reference
        foreign key (reference_id) references course_references (id),
    constraint fk_reads_user
        foreign key (user_id) references users (id)
);

create table user_section_statuses
(
    id         bigint unsigned auto_increment
        primary key,
    created_at datetime(3)     null,
    updated_at datetime(3)     null,
    deleted_at datetime(3)     null,
    user_id    bigint unsigned null,
    section_id bigint unsigned null,
    completed  tinyint(1)      null,
    constraint fk_sections_user_status
        foreign key (section_id) references sections (id),
    constraint fk_users_section_status
        foreign key (user_id) references users (id)
);

create index idx_user_section_statuses_deleted_at
    on user_section_statuses (deleted_at);

create index idx_user_section_statuses_section_id
    on user_section_statuses (section_id);

create index idx_user_section_statuses_user_id
    on user_section_statuses (user_id);

create index idx_users_deleted_at
    on users (deleted_at);


