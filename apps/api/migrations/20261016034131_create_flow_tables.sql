CREATE TABLE "execution_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"execution_id" uuid NOT NULL,
	"step_id" uuid,
	"level" text NOT NULL,
	"message" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "ck_execution_logs__level" CHECK ("execution_logs"."level" in ('info', 'error'))
);
--> statement-breakpoint
CREATE TABLE "executions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"flow_id" uuid NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"started_at" timestamp with time zone,
	"finished_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "ck_executions__status" CHECK ("executions"."status" in ('pending', 'running', 'succeeded', 'failed')),
	CONSTRAINT "ck_executions__finished_after_started" CHECK ("executions"."finished_at" is null or ("executions"."started_at" is not null and "executions"."finished_at" >= "executions"."started_at"))
);
--> statement-breakpoint
CREATE TABLE "flows" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"archived_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "ck_flows__name_length" CHECK (char_length("flows"."name") between 1 and 120)
);
--> statement-breakpoint
CREATE TABLE "steps" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"flow_id" uuid NOT NULL,
	"position" integer NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "uq_steps__flow_id__position" UNIQUE("flow_id","position"),
	CONSTRAINT "ck_steps__position" CHECK ("steps"."position" >= 1),
	CONSTRAINT "ck_steps__name_length" CHECK (char_length("steps"."name") between 1 and 120)
);
--> statement-breakpoint
ALTER TABLE "execution_logs" ADD CONSTRAINT "fk_execution_logs__execution_id" FOREIGN KEY ("execution_id") REFERENCES "public"."executions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "execution_logs" ADD CONSTRAINT "fk_execution_logs__step_id" FOREIGN KEY ("step_id") REFERENCES "public"."steps"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "executions" ADD CONSTRAINT "fk_executions__flow_id" FOREIGN KEY ("flow_id") REFERENCES "public"."flows"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "steps" ADD CONSTRAINT "fk_steps__flow_id" FOREIGN KEY ("flow_id") REFERENCES "public"."flows"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_execution_logs__execution_id__created_at" ON "execution_logs" USING btree ("execution_id","created_at");--> statement-breakpoint
CREATE INDEX "idx_executions__flow_id__created_at" ON "executions" USING btree ("flow_id","created_at");