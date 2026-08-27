import { Mail, Linkedin, Globe } from "lucide-react";

/**
 * Shared "about this project" note used on the landing page, the /become-a-tasker
 * footer and the /tasks footer. Kept deliberately understated and on-brand.
 *
 * Replace the placeholder contact links with your real email / LinkedIn / portfolio.
 */
export function AboutProjectNote({ className }: { className?: string }) {
  return (
    <div className={className}>
      <p className="text-sm leading-relaxed text-slate-500">
        TaskHub is a design &amp; development portfolio demo — a concept showcase, not a real
        company or live service.
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
        <a
          href="mailto:hello@yourname.dev"
          className="inline-flex items-center gap-2 text-slate-600 transition-colors hover:text-primary"
        >
          <Mail className="h-4 w-4" /> Email
        </a>
        <a
          href="https://www.linkedin.com/in/yourname"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-slate-600 transition-colors hover:text-primary"
        >
          <Linkedin className="h-4 w-4" /> LinkedIn
        </a>
        <a
          href="https://yourname.dev"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-slate-600 transition-colors hover:text-primary"
        >
          <Globe className="h-4 w-4" /> Portfolio
        </a>
      </div>
    </div>
  );
}
