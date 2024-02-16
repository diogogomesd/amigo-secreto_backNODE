import { RequestHandler } from "express";
import * as events from '../services/Events';
import * as people from '../services/People';
import { z } from "zod";

export const getAll: RequestHandler = async (req, res) => {
    const items = await events.getAll();
    if (items) return res.json({ events: items });
    res.json({ error: "Ocorreu um erro ao buscar dados" })
}
export const getEvent: RequestHandler = async (req, res) => {
    const { id } = req.params;
    const item = await events.getOne(parseInt(id));
    if (item) return res.json({ event: item })

    res.json({ error: "Ocorreu um erro ao buscar dados por id" })
}
export const addEvent: RequestHandler = async (req, res) => {
    const addEventSchema = z.object({
        title: z.string(),
        description: z.string(),
        grouped: z.boolean()
    })
    const body = addEventSchema.safeParse(req.body);
    if (!body.success) return res.json({ error: 'Os dados são inválidos' });
    const newEvent = await events.add(body.data);
    if (newEvent) return res.status(201).json({ event: newEvent });
    res.json({ error: 'Ocorreu um erro ao criar novo evento' });
}
export const updateEvent: RequestHandler = async (req, res) => {
    const { id } = req.params;
    const updateEventSchema = z.object({
        status: z.boolean().optional(),
        title: z.string().optional(),
        description: z.string().optional(),
        grouped: z.boolean().optional()
    })
    const body = updateEventSchema.safeParse(req.body);
    if (!body.success) return res.json({ error: 'Os dados são inválidos' });
    const updatedEvent = await events.update(parseInt(id), body.data)
    if (updatedEvent) {
        //aqui faz o sorteio
        if (updatedEvent.status) {
          const result = await events.doMatches(parseInt(id));
          if(!result)return res.json({error: 'Grupos impossíveis de sortear'});  
        } 
        //aqui limpa os sorteios
        else {
            await people.update({id_event:parseInt(id)}, {matched:''})

        }

        return res.json({ event: updatedEvent });
    }
    res.json({ error: 'Ocorreu um erro ao atualizar o evento' });
}
export const deleteEvent: RequestHandler = async (req, res) => {
    const { id } = req.params;
    const deletedEvent = await events.remove(parseInt(id));
    if (deletedEvent) return res.json({ event: deletedEvent });
    res.json({ error: 'Ocorreu um erro ao deletar o evento' });
}