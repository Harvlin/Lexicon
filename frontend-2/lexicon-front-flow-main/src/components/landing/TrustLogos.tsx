export function TrustLogos(){
  const items = ['Developers','Analysts','Designers','Founders','Students'];
  return (
    <section className="py-20" id="about">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-10">Trusted by learners worldwide</p>
        <div className="flex flex-wrap justify-center gap-8 opacity-70">
          {items.map(i => <span key={i} className="text-xl md:text-2xl font-heading font-semibold text-foreground/80">{i}</span>)}
        </div>
      </div>
    </section>
  );
}
