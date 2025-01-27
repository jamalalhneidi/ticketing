import mongoose from 'mongoose';
import Ticket from '../ticket';

it('throw outdated error', async () => {
    const ticket = Ticket.build({
        title: 'title',
        price: 20,
        userId: new mongoose.Types.ObjectId().toHexString(),
    });
    await ticket.save();

    const t1 = await Ticket.findById(ticket.id);
    const t2 = await Ticket.findById(ticket.id);
    expect(t1).toBeDefined();
    expect(t2).toBeDefined();

    t1!.title = 't1_title';
    t2!.title = 't2_title';
    await t1!.save();

    await expect(async () => {
        await t2!.save();
    }).rejects.toThrow();
});

it('increment version number', async () => {
    const ticket = Ticket.build({
        title: 'title',
        price: 20,
        userId: new mongoose.Types.ObjectId().toHexString(),
    });
    await ticket.save();
    expect(ticket.version).toEqual(0);

    for (let i = 1; i <= 10; i++) {
        const t = await Ticket.findById(ticket.id);
        t!.price = i;
        await t!.save();
        expect(t!.version).toEqual(i);
    }
});
