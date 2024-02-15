import { RequestHandler } from "express";
import * as groups from '../services/Groups';


export const getAll: RequestHandler = async (req, res) => {
    const { id_event } = req.params;
    const items = await groups.getAll(parseInt(id_event));
    if (items) return res.json({ groups: items })
    res.json({ error: 'Lista de grupos não encontrada..' })

}
export const getGroup: RequestHandler = async (req, res) => {
    const{id, id_event} = req.params;
    const groupItem = await groups.getOne({
        id: parseInt(id),
        id_event: parseInt(id_event)
    });
    if(groupItem) return res.json({group: groupItem});
    res.json({ error: 'grupo não encontrado..' })
}