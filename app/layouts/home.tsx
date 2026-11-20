import { PageFrame } from "$app/layouts/page.tsx";

export default function Home(data: Lume.Data) {
  const page = data as Lume.Data & { search: { pages: (...args: string[]) => unknown[] }; SITE_BUILD_ID?: string };

  return (
    <PageFrame data={page}>
      <div className="intro">
        <p>
          I specialise in actively leading software teams to build scalable, well-defined technical solutions.
        </p>

        <p>
          With over 15 years of experience working in various roles in the software industry, I’ve learnt to embrace new
          technologies, define research-backed technical solutions, build productive teams and lead from the front.
        </p>

        <p>
          I keep my technical skills current by continuing to deliver app-level tasks while also ensuring the team is
          heading in the right direction to deliver the overall solution efficiently.
        </p>
      </div>
    </PageFrame>
  );
}
