import Link from "next/link";

type PageHeroProps = {
  title: string;
  image: string;
};

export function PageHero({ title, image }: PageHeroProps) {
  return (
    <section className="page-hero" style={{ backgroundImage: `linear-gradient(rgba(4, 22, 46, 0.68), rgba(4, 22, 46, 0.68)), url(${image})` }}>
      <div className="shell page-hero-inner">
        <h1>{title}</h1>
        <div className="breadcrumbs">
          <Link href="/">Home</Link>
          <span>/</span>
          <span>{title}</span>
        </div>
      </div>
    </section>
  );
}
