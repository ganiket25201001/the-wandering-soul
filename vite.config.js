import {defineConfig,loadEnv} from 'vite';

export default defineConfig(({mode})=>{
 const env={...loadEnv(mode,process.cwd(),''),...process.env};
 const configured=env.SITE_URL||env.VERCEL_PROJECT_PRODUCTION_URL||env.VERCEL_URL||'https://the-wandering-soul.vercel.app';
 const site=new URL(configured.startsWith('http')?configured:`https://${configured}`).origin;
 return {plugins:[{name:'public-sharing-metadata',transformIndexHtml(html){return html.replaceAll('__PUBLIC_SITE_URL__',site)}}]};
});
