import { Command, Flags } from '@oclif/core'
const fetch = require("node-fetch");
import {cli} from 'cli-ux'
import { api } from '../../api';
import * as fs from 'fs-extra';
import * as path from 'path';

export default class ListRepos extends Command {
    
    static description = 'Listar Repositórios Existentes'

    static examples = [`$ nftcommit signup`]

    async run(): Promise<void> {
        const {flags}:any = {
            ...cli.table.flags()
        }

        let user_mail = fs.readJSONSync(path.join(this.config.configDir, 'config.json')).NFTCOMMIT_USER;
        let response = await fetch(api+'list-repos/'+user_mail, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(async (res:any) => {
                if(res.status === 200)
                {
                    let repos = JSON.parse(await res.json())
                        .map((repo:any) => ({
                            nome: repo.replace('.git', ''),
                            link: `${api+repo.replace('.git', '')}/repo-info.html`
                        }))
                
                    cli.table(repos, {
                        nome: {
                            minWidth: 20,
                        },
                        link: {
                            minWidth: 20,
                        }
                    }, { ...flags })
                }
                else if(res.status === 500)
                {
                    this.log(`Erro ao listar!`);
                    res.json().then((json:any) => {
                        this.log(json);
                    })  
                }
            })
            .catch((err:any) => {
                this.error(err)
            });
    }
}
