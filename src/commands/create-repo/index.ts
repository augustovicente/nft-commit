import { Command } from '@oclif/core'
import * as inquirer from 'inquirer'
import { api } from '../../api';
const fetch = require("node-fetch");
const { spawn } = require("child_process");
import * as fs from 'fs-extra';
import * as path from 'path';

export default class CreateRepo extends Command {
    static description = 'Criar Repositório NFTCommit'

    static examples = [`$ nftcommit signup`]

    async run(): Promise<void> {
        this.log('Vamos criar o MELHOR repositório!')

        let user_responses: any = await inquirer.prompt([
            {
                name: 'name',
                message: 'Qual o nome do repositório?',
                type: 'input',
                validate: (value: string) => {
                    if (value.length) {
                        return true
                    } else {
                        return 'Nome inválido'
                    }
                }
            },
        ])

        let user_mail = fs.readJSONSync(path.join(this.config.configDir, 'config.json')).NFTCOMMIT_USER;
        let response = await fetch(api+'create-repo/'+encodeURI(user_mail), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: user_responses.name,
                email: (global as any)['NFTCOMMIT_USER']
            }),
        })
            .then((res:any) => {
                if(res.status === 200)
                {
                    this.log(`✅ Repositório criado com sucesso!`);
                    spawn('git', [
                        'clone',
                        `ssh://git@localhost:2222/git-server/repos/${user_responses.name}.git`
                    ])
                }
                else if(res.status === 500)
                {
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
