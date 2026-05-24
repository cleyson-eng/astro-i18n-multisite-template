import { siteDomains, siteRoots, siteMap } from "../src/meta/sitemap.ts";
import { domainAsVarName, genMapLinks, mapRootsDomain, mapRootsLocal } from "./sitemap_data.ts";
import * as path from "node:path";
import * as fs from "node:fs";

const root = import.meta.dirname as string;
const src_root = path.resolve(root, '../src');
const build_path = path.resolve(root, './build.bat');//<< change to linux

function delete_ifexists(x:string) {
	console.log('removed: '+x);
	const p = path.resolve(src_root, x);
	if (fs.existsSync(p))
		//@ts-ignore
		fs.rmSync(p, {recursive:true, force:true});
}

//debug links
delete_ifexists('pages_redirect/debug');
genMapLinks(src_root, 'pages_redirect/debug', mapRootsLocal(siteRoots, siteDomains), siteMap);

siteDomains.forEach((domain)=>{
	const vname = 'pages_redirect/'+domainAsVarName(domain);
	delete_ifexists(vname);
	genMapLinks(src_root, vname, mapRootsDomain(siteRoots, domain), siteMap);
});


fs.writeFileSync(build_path,
siteDomains.map((v)=>
`set SITE_DOMAIN=${v}
call npm run build`
).join('\n'), 'utf-8');