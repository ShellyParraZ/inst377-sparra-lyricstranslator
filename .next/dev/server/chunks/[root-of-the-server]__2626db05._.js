module.exports = [
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/pages/api/index.js [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>handler
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$supabase$2f$supabase$2d$js__$5b$external$5d$__$2840$supabase$2f$supabase$2d$js$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$29$__ = __turbopack_context__.i("[externals]/@supabase/supabase-js [external] (@supabase/supabase-js, esm_import, [project]/node_modules/@supabase/supabase-js)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f40$supabase$2f$supabase$2d$js__$5b$external$5d$__$2840$supabase$2f$supabase$2d$js$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f40$supabase$2f$supabase$2d$js__$5b$external$5d$__$2840$supabase$2f$supabase$2d$js$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
// Initialize Supabase using environment variables
const supabase = (0, __TURBOPACK__imported__module__$5b$externals$5d2f40$supabase$2f$supabase$2d$js__$5b$external$5d$__$2840$supabase$2f$supabase$2d$js$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$29$__["createClient"])(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
// DeepL API key
const DEEPL_API_KEY = process.env.DEEPL_API_KEY;
async function handler(req, res) {
    console.log({
        SUPABASE_URL: process.env.SUPABASE_URL,
        SUPABASE_KEY: !!process.env.SUPABASE_KEY,
        DEEPL_API_KEY: !!process.env.DEEPL_API_KEY
    });
    res.setHeader("Access-Control-Allow-Origin", "*");
    // to prevent 405 error
    if (req.method === "OPTIONS") {
        res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");
        return res.status(200).end();
    }
    // blocks everything except POST
    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }
    const { title, artist, originalLang, targetLang, originalLyrics } = req.body;
    if (!title || !artist || !originalLang || !targetLang || !originalLyrics) {
        return res.status(400).json({
            error: "Missing required inputs"
        });
    }
    try {
        // Check if translation exists
        const { data: existing, error: selectError } = await supabase.from("lyrics_data").select("title, artist, original_lyrics, translated_lyrics, original_lang, target_lang").eq("title", title).eq("artist", artist).eq("original_lang", originalLang).eq("target_lang", targetLang).limit(1);
        if (selectError) throw selectError;
        if (existing && existing.length > 0) {
            return res.status(200).json(existing[0]); // return previous translation
        }
        // fetching DEEPL API to get lyric translation
        const deeplRes = await fetch("https://api-free.deepl.com/v2/translate", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                auth_key: DEEPL_API_KEY,
                text: originalLyrics,
                target_lang: targetLang
            })
        });
        const deeplData = await deeplRes.json();
        if (!deeplData.translations || !deeplData.translations[0].text) {
            throw new Error("!!!DeepL translation failed!!!");
        }
        const translatedLyrics = deeplData.translations[0].text;
        // INSERT THE NEW TRANSLATION
        const { data, error: insertError } = await supabase.from("lyrics_data").insert([
            {
                title,
                artist,
                original_lang: originalLang,
                target_lang: targetLang,
                original_lyrics: originalLyrics,
                translated_lyrics: translatedLyrics
            }
        ]).select();
        if (insertError) throw insertError;
        return res.status(201).json(data[0]);
    } catch (extra_err) {
        console.error(extra_err);
        return res.status(500).json({
            error: extra_err.message
        });
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__2626db05._.js.map