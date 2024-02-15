import { Router } from "express";
import * as auth from '../controllers/auth';
import * as events from '../controllers/events';
import * as groups from '../controllers/groups';

const router = Router();

router.post('/login', auth.login);
router.get('/ping', auth.validate, (req, res) => res.json({ pong: true, admin: true }));

//rotas de eventos
router.get('/events', auth.validate, events.getAll);
router.get('/events/:id', auth.validate, events.getEvent);
router.post('/events', auth.validate, events.addEvent);
router.put('/events/:id', auth.validate, events.updateEvent);
router.delete('/events/:id', auth.validate, events.deleteEvent);

//rotas de grupos
router.get('/events/:id_event/groups', auth.validate, groups.getAll)
router.get('/events/:id_event/groups/:id', auth.validate, groups.getGroup)

export default router;