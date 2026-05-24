ALTER TABLE "posts" RENAME COLUMN "publishedAt" TO "published_at";--> statement-breakpoint
ALTER TABLE "posts" DROP CONSTRAINT "posts_title_unique";