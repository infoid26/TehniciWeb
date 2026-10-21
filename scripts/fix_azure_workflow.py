"""Upgrade the Azure-generated workflow without changing its OIDC credentials."""
from pathlib import Path
import re

ROOT=Path(__file__).resolve().parents[1]
WORKFLOW=ROOT/'.github/workflows/main_infoid26.yml'

def upgrade(source):
    if 'azure/webapps-deploy@' not in source:
        raise ValueError('The selected file is not an Azure App Service workflow.')
    updated=source.replace('\r\n','\n')
    for action,version in {
        'actions/checkout':'v5',
        'actions/setup-node':'v6',
        'actions/upload-artifact':'v6',
        'actions/download-artifact':'v7',
        'azure/login':'v3',
        'azure/webapps-deploy':'v3',
    }.items():
        updated=re.sub(re.escape(action)+r'@v\d+(?:\.\d+)*',action+'@'+version,updated,flags=re.IGNORECASE)
    updated=updated.replace('runs-on: ubuntu-latest','runs-on: ubuntu-24.04')
    updated=re.sub(r"node-version:\s*['\"]?\d+(?:\.x)?['\"]?", "node-version: '24.x'",updated)
    if 'npm run test --if-present' in updated:
        updated=updated.replace('npm run test --if-present','npm run check\n          npm run check:learning\n          npm run check:azure')
    if 'startup-command:' not in updated:
        updated=re.sub(r'(?m)^(\s*)package: (.+)$',r"\1startup-command: 'npm start'\n\1package: \2",updated)
    return '\n'.join(line.rstrip() for line in updated.splitlines()).rstrip()+'\n'

if __name__=='__main__':
    if not WORKFLOW.is_file():
        raise SystemExit('Run git pull --ff-only first to download the Azure-created workflow.')
    before=WORKFLOW.read_text(encoding='utf8')
    after=upgrade(before)
    WORKFLOW.write_text(after,encoding='utf8',newline='\n')
    print('Updated Azure workflow to Node 24 actions, Ubuntu 24.04, validation checks and npm start.')
