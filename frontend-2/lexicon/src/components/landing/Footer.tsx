import { Link } from 'react-router-dom';

export function LandingFooter(){
  return (
    <footer className="py-20 border-t bg-muted/40 mt-32" id="footer">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-5 gap-12 mb-16">
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg bg-accent text-accent-foreground flex items-center justify-center font-bold">L</div>
              <span className="font-heading font-semibold text-xl">Lexigrain</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-sm">Empowering learning through intelligent simplicity—micro progress that compounds using adaptive AI.</p>
          </div>
          <LinkGroup title="Product" links={['Features','Study Plan','AI Engine']} />
          <LinkGroup title="Company" links={['About','Blog','Careers','Contact']} />
          <LinkGroup title="Resources" links={['Docs','API (soon)','Help Center','Community']} />
        </div>
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between text-xs text-muted-foreground border-t pt-6">
          <p>© {new Date().getFullYear()} Lexigrain. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground">Privacy</a>
            <a href="#" className="hover:text-foreground">Terms</a>
            <a href="#" className="hover:text-foreground">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function LinkGroup({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h4 className="font-semibold mb-4 text-sm tracking-wide uppercase text-muted-foreground">{title}</h4>
      <ul className="space-y-2 text-sm">
        {links.map(l => <li key={l}><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">{l}</a></li>)}
      </ul>
    </div>
  );
}
