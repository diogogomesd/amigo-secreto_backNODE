import { RequestHandler } from "express";
import * as people from '../services/People';
import { z } from "zod";

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