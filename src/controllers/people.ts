import { RequestHandler } from "express";
import * as people from '../services/People';
import { z } from "zod";
import { decrypt } from "dotenv";
import { decryptMatch } from "../utils/match";

export const getAll: RequestHandler = async (req, res) => {
    const { id_event, id_group } = req.params;
    const items = await people.getAll({
        id_event: parseInt(id_event),
        id_group: parseInt(id_group)
    })
    if (items) return res.json({ people: items });
    res.json({ error: 'Houve um erro ao buscar as pessoas' })
}
export const getPerson: RequestHandler = async (req, res) => {
    const { id, id_event, id_group } = req.params;
    const personItem = await people.getOne({
        id: parseInt(id),
        id_event: parseInt(id_event),
        id_group: parseFloat(id_group)
    })
    if (personItem) return res.json({ person: personItem });
    res.json({ error: 'Houve um erro ao buscar a pessoa...' });
}
export const addPerson: RequestHandler = async (req, res) => {
    const { id_event, id_group } = req.params
    const addPersonSchema = z.object({
        name: z.string(),
        cpf: z.string().transform(val => val.replace(/\.|-/gm, ''))
    });
    const body = addPersonSchema.safeParse(req.body);
    if (!body.success) return res.json({ error: 'Dados inválidos...' });
    const newPerson = await people.add({
        name: body.data.name,
        cpf: body.data.cpf,
        id_event: parseInt(id_event),
        id_group: parseInt(id_group)
    });
    if (newPerson) return res.status(201).json({ person: newPerson });
    res.json({ error: 'houve um erro ao criar a pessoa...' })
}
export const updatePerson: RequestHandler = async (req, res) => {
    const { id, id_event, id_group } = req.params;
    const updatePersonSchema = z.object({
        name: z.string().optional(),
        cpf: z.string().transform(val => val.replace(/\.|-/gm, '')).optional(),
        matched: z.string().optional()
    });
    const body = updatePersonSchema.safeParse(req.body);
    if (!body.success) return res.json({ error: 'Dados inválidos para atualização...' })
    const updatedPerson = await people.update({
        id: parseInt(id),
        id_event: parseInt(id_event),
        id_group: parseInt(id_group)
    }, body.data);
    if (updatedPerson) {
        const personItem = await people.getOne({
            id: parseInt(id),
            id_event: parseInt(id_event)
        })
        return res.json({ person: personItem });
    }

    res.json({ error: 'Houve um erro ao atualizar dados da pessoa...' })
}
export const removePerson: RequestHandler = async (req, res) => {
    const { id, id_event, id_group } = req.params;
    const deletedPerson = await people.remove({
        id: parseInt(id),
        id_event: parseInt(id_event),
        id_group: parseInt(id_group)
    });
    if (deletedPerson) return res.json({ person: deletedPerson })
    res.json({ error: 'Houve um erro ao excluir a pessoa...' })
}
export const searchPeople: RequestHandler = async (req, res) => {
    const { id_event } = req.params;
    const searchPersonSchema = z.object({
        cpf: z.string().transform(val => val.replace(/\.|-/gm, ''))
    });
    const query = searchPersonSchema.safeParse(req.query);
    if (!query.success) return res.json({ error: 'Cpf enviado é inválido...' });
    const personItem = await people.getOne({
        id_event: parseInt(id_event),
        cpf: query.data.cpf
    });
    if(personItem && personItem.matched){
        const matchId = decryptMatch(personItem.matched);
        const personMetched = await people.getOne({
            id_event: parseInt(id_event),
            id: matchId
        });
        if(personMetched){
            return res.json({
                person:{
                    id: personItem.id,
                    name: personItem.name
                },
                personMatched:{
                    id: personMetched.id,
                    name: personMetched.name
                }
            });
        }
    }
    res.json({error: 'Não foi encontrado sorteio para o cpf informado...'});

}