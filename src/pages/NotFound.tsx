import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { AlertTriangle, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: Access attempted to:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 px-4">
        <div className="max-w-2xl w-full">
          {/* Bloc d'erreur principal - Bordure 2.5px et ombre portée forte */}
          <div className="bg-white border-[2.5px] border-slate-900 p-8 md:p-16 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] text-center relative overflow-hidden">
            
            {/* Filigrane discret en arrière-plan */}
            <div className="absolute top-0 right-0 text-slate-100 font-black text-9xl -mr-10 -mt-10 select-none">
              404
            </div>

            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-accent mb-8 border-[2px] border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
                <AlertTriangle className="h-10 w-10 text-slate-900" />
              </div>

              <h1 className="text-6xl md:text-8xl font-black text-slate-900 uppercase italic tracking-tighter mb-4">
                ERREUR 404
              </h1>
              
              <div className="bg-slate-900 text-white py-2 px-4 inline-block mb-8 uppercase font-bold tracking-widest text-xs">
                Zone Hors-Périmètre
              </div>

              <p className="text-lg text-slate-500 font-bold uppercase italic mb-12 max-w-md mx-auto leading-tight">
                La ressource demandée à l'adresse <span className="text-accent not-italic">{location.pathname}</span> est introuvable ou a été déplacée.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/">
                  <Button className="w-full sm:w-auto h-14 rounded-none bg-slate-900 hover:bg-accent text-white hover:text-slate-900 font-black uppercase tracking-widest px-8 transition-all border-b-[4px] border-accent active:translate-y-1">
                    <Home className="mr-2 h-5 w-5" />
                    RETOUR ACCUEIL
                  </Button>
                </Link>
                
                <Button 
                  onClick={() => window.history.back()}
                  variant="outline" 
                  className="w-full sm:w-auto h-14 rounded-none border-[2px] border-slate-900 font-black uppercase tracking-widest px-8 hover:bg-slate-100"
                >
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  PAGE PRÉCÉDENTE
                </Button>
              </div>
            </div>
          </div>

          {/* Note technique de bas de page */}
          <div className="mt-8 flex items-center justify-center gap-4 text-slate-400">
            <div className="h-[1px] w-12 bg-slate-200"></div>
            <span className="font-mono text-[10px] uppercase tracking-widest">SICAF Technical Support System</span>
            <div className="h-[1px] w-12 bg-slate-200"></div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
