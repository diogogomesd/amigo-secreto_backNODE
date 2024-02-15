import { RequestHandler } from "express";
import { z } from "zod";
import * as groups from '../services/Groups';

export const getAll: RequestHandler = async (req, res) => {
    const { id_event } = req.params;
    const items = await groups.getAll(parseInt(id_event));
    if (items) return res.json({ groups: items })
    res.json({ error: 'Lista de grupos não encontrada..' })

}
export const getGroup: RequestHandler = async (req, res) => {
    const { id, id_event } = req.params;
    const groupItem = await groups.getOne({
        id: parseInt(id),
        id_event: parseInt(id_event)
    });
    if (groupItem) return res.json({ group: groupItem });
    res.json({ error: 'grupo não encontrado..' })
}
export const addGroups: RequestHandler = async (req, res) => {
    const { id_event } = req.params;
    const addGroupSchema = z.object({
        name: z.string()
    });
    const body = await addGroupSchema.safeParse(req.body);
    if (!body.success) return res.json({ error: "Dados inválidos..." });

    const newGroup = await groups.add({
        name: body.data.name,
        id_event: parseInt(id_event)
    });
    if (newGroup) return res.status(201).json({ group: newGroup });
    res.json({ error: "Ocorreu um erro ao inserir um novo grupo....." })
}
export const updateGroup: RequestHandler = async (req, res) => {
    const { id, id_event } = req.params;
    const updateSchema = z.object({
        name: z.string().optional()
    });
    const body = updateSchema.safeParse(req.body);
    if (!body.success) return res.json({ error: "Houve um erro ao atualizar o grupo..." })
    const updatedGroup = await groups.update({
        id: parseInt(id),
        id_event: parseInt(id_event)
    }, body.data);
    if (updatedGroup) return res.json({ group: updatedGroup });

    res.json({ error: 'Ocorreu um erro ao atualizar o grupo...' });
}
export const deleteGroup: RequestHandler = async (req, res) => {
    const { id, id_event } = req.params;
    const deletedGroup = await groups.remove({
        id: parseInt(id),
        id_event: parseInt(id_event)
    })
    if (deletedGroup) return res.json({ group: deletedGroup })
    res.json({ error: 'Houve um erro ao excluir grupo...' })
}