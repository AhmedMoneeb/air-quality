\c air_quality
CREATE TABLE IF NOT EXISTS public.pollution
(
    id uuid NOT NULL,
    country text COLLATE pg_catalog."default" NOT NULL,
    city text COLLATE pg_catalog."default" NOT NULL,
    ts text COLLATE pg_catalog."default",
    aqius double precision,
    mainus text COLLATE pg_catalog."default",
    aqicn double precision,
    maincn text COLLATE pg_catalog."default",
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT pollution_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.pollution
    OWNER to postgres;

CREATE INDEX idx_pollution_city ON public.pollution (city);

CREATE INDEX idx_pollution_aqius ON public.pollution (aqius DESC);