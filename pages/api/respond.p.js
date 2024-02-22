import ConversationManager from "@/src/constant";

export default async function handler(req, res) {
    const id = req.query.id;
    //    console.log(id)
    let chain = ConversationManager[id]?.chain;
    if (!chain) {
        res.json({"ok": false})
        return;
    }
    //  console.log(ConversationManager);
    let response = await chain.call({ input: req.query.query });
    res.json({ok: true, text: response});
}
