import urllib.request
import urllib.parse
import os
import json
import time

items = [
    # --- 25 SKINS DE CS2 ---
    {
        "name": "AK-47 | Case Hardened",
        "type": "skins",
        "url": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwlcK3wiNK0P2nZKFpH_yaCW-Ej7sk5bE8Sn-2lEpz4zndzoyvdHuUPwFzWZYiE7EK4Bi4k9TlY-y24FbAy9USGSiZd5Q",
        "filename": "ak47_case_hardened.png"
    },
    {
        "name": "AWP | Dragon Lore",
        "type": "skins",
        "url": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwiYbf_jdk4veqYaF7IfysCnWRxuF4j-B-Xxa_nBovp3Pdwtj9cC_GaAd0DZdwQu9fuhS4kNy0NePntVTbjYpCyyT_3CgY5i9j_a9cBkcCWUKV",
        "filename": "awp_dragon_lore.png"
    },
    {
        "name": "Bowie Knife | Lore",
        "type": "skins",
        "url": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1I-uC4YbJsLM-RAXCZxNF1pd5rQD66kCIrvC-ApYPwJiPTcAJyAsZ3FrINuhK-l9O2Yei35wTago9NyCj4iHtP5n5itbsGA6FwqaTJz1aWiYxmw3g",
        "filename": "bowie_knife_lore.png"
    },
    {
        "name": "M9 Bayonet | Crimson Web",
        "type": "skins",
        "url": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Wts2sab1iLvWHMW-J_vlzsvJWQyC0nQlp4GrWzYuqeHjDZlN1XJohTecO5xawwdDvNuLm5wPcjY0QzyX83Xsd7zErvbgxKe4lfw",
        "filename": "m9_bayonet_crimson_web.png"
    },
    {
        "name": "Glock-18 | Fade",
        "type": "skins",
        "url": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL2kpnj9h1a7s2oaaBoH_yaCW-Ej-8u5bZvHnq1w0Vz62TUzNj4eCiVblMmXMAkROJeskLpkdXjMrzksVTAy9US8PY25So",
        "filename": "glock18_fade.png"
    },
    {
        "name": "Karambit | Case Hardened",
        "type": "skins",
        "url": "https://community.akamai.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJfx_LLZTRB7dCJlY20kvrxIbrdklRc6ddzhuzI74nxt1i9rBsofWD2IIDDcFQ9MwvV-FO5xejngpK16c6bmyZguiUj7HqMnRfjhBhOOOJxxavJeVUN3dA",
        "filename": "karambit_case_hardened.png"
    },
    {
        "name": "Butterfly Knife | Doppler Zafiro",
        "type": "skins",
        "url": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1M5vahf6lsK_WBMWad_up5oPFlSjuMhRUmoDjWpZjwJSTQAVp5Xco0W-8M4RG7wdPhYrvm4FPZio1Ezi323HhN6ytp47tRWKcsrqCBigzDOLUjoc5UMQO3baE",
        "filename": "butterfly_knife_doppler_zafiro.png"
    },
    {
        "name": "M4A4 | Howl",
        "type": "skins",
        "url": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8ypexwiFO0P_6afVSKP-EAm6extF6ueZhW2exwkl2tmTXwt39eCiUPQR2DMN4TOVetUK8xoLgM-K341eM2otDnC6okGoXufBz_TAB",
        "filename": "m4a4_howl.png"
    },
    {
        "name": "AK-47 | Redline",
        "type": "skins",
        "url": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwlcK3wiFO0POlPPNSI_-RHGavzedxuPUnFniykEtzsWWBzoyuIiifaAchDZUjTOZe4RC_w4buM-6z7wzbgokUyzK-0H08hRGDMA",
        "filename": "ak47_redline.png"
    },
    {
        "name": "Desert Eagle | Blaze",
        "type": "skins",
        "url": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL1m5fn8Sdk7vORbqhsLfWAMWuZxuZi_uI_TX6wxxkjsGXXnImsJ37COlUoWcByEOMOtxa5kdXmNu3htVPZjN1bjXKpkHLRfQU",
        "filename": "desert_eagle_blaze.png"
    },
    {
        "name": "AWP | Gungnir",
        "type": "skins",
        "url": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwiYbf-jFk7uW-V6N4LvedB3WvzedxuPUnHnjnzUl0sWrdztitI3rDZgJzAsZ1QOFY4UPqldDgMO_l41HXit9AmTK-0H227dAsvQ",
        "filename": "awp_gungnir.png"
    },
    {
        "name": "AK-47 | Wild Lotus",
        "type": "skins",
        "url": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwlcK3wiFO0POlV61-LPGdCliWzeFkse1WQyC0nQlpsDuGyt-pdnyRPA4hDcYkR-QPuhi-wdPuYbyx5AaMidkQnC_-2ilIuzErvbi4ijV5Mw",
        "filename": "ak47_wild_lotus.png"
    },
    {
        "name": "Karambit | Doppler",
        "type": "skins",
        "url": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Q7uCvZaZkNM-SA1iUzv5mvOR7cDm7lA4i4gKJk4jxNWXFb1cpDJR2FOFbsBTql9bjYbzq7gPZiN1MxH7_2ytNuCdpte1UB_Ui5OSJ2GbkVqni",
        "filename": "karambit_doppler.png"
    },
    {
        "name": "M4A1-S | Welcome to the Jungle",
        "type": "skins",
        "url": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8ypexwjFS4_ega6F_H_OGMWrEwL9Jo-9oRCyMmRQguynLzYqgInjGZlcnX5ciE-IPthLrkN3hYu_ltQPW3Y1NzSn-jCpJ6ydpsvFCD_TdxQe8NQ",
        "filename": "m4a1s_welcome_to_the_jungle.png"
    },
    {
        "name": "AWP | Asiimov",
        "type": "skins",
        "url": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwiYbf_jdk7uW-V6V-Kf2cGFidxOp_pewnF3nhxEt0sGnSzN76dH3GOg9xC8FyEORftRe-x9PuYurq71bW3d8UnjK-0H0YSTpMGQ",
        "filename": "awp_asiimov.png"
    },
    {
        "name": "AK-47 | Vulcan",
        "type": "skins",
        "url": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwlcK3wiFO0POlPPNSMuWRDGKC_uJ_t-l9AXCxxEh14zjTztivci2ePQZ2W8NzTecD4BKwloLiYeqxtAOIj9gUyyngznQeF7I6QE8",
        "filename": "ak47_vulcan.png"
    },
    {
        "name": "USP-S | Kill Confirmed",
        "type": "skins",
        "url": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLkjYbf7itX6vytbbZSI-WsG3SA_uV_vO1WTCa9kxQ1vjiBpYPwJiPTcFB2Xpp5TO5cskG9lYCxZu_jsVCL3o4Xnij23ClO5ik9tegFA_It8qHJz1aWe-uc160",
        "filename": "usps_kill_confirmed.png"
    },
    {
        "name": "Karambit | Fade",
        "type": "skins",
        "url": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Q7uCvZaZkNM-SD1iWwOpzj-1gSCGn20tztm_UyIn_JHKUbgYlWMcmQ-ZcskSwldS0MOnntAfd3YlMzH35jntXrnE8SOGRGG8",
        "filename": "karambit_fade.png"
    },
    {
        "name": "M9 Bayonet | Lore",
        "type": "skins",
        "url": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Wts2sab1iLvWHMWSF_uMvj-NoVha_mg8ijDGMnYftbyrBOw52D5R0FOYPtkG6ltOxNrjl4FPdiN0WzC723SxP6ypp6u8LVKY7uvqAFpeI3XY",
        "filename": "m9_bayonet_lore.png"
    },
    {
        "name": "Sport Gloves | Vice",
        "type": "skins",
        "url": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Tk5UvzWCL2kpn2-DFk_OKherB0H_KfG2Kv0ed4u95lRi67gVNx4T-Bw434IHyVb1QlAsd1FOUDthG4xNznMu3m4QXXg90Wzn_33C1I8G81tLaDi_rK",
        "filename": "sport_gloves_vice.png"
    },
    {
        "name": "Specialist Gloves | Crimson Kimono",
        "type": "skins",
        "url": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Tk71ruQBH4jYLf-i5U-fe9V7d9JfOaD2uZ0vpJu-hkQCe8qhkusjCKlIvqHjnCOml8U8UoAfkItBLswdbuNbjr5FHdjNkUzSv73C1K5y46tu4EUvAg-6bU3FrBMOE4_9BdcyhkRns5",
        "filename": "specialist_gloves_crimson_kimono.png"
    },
    {
        "name": "Desert Eagle | Printstream",
        "type": "skins",
        "url": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL1m5fn8Sdk7OeRbKFsJ8-DHG6e1f1iouRoQha_nBovp3OGmdeqInyVP1V0XsYlRbEI50a5wNyzZr605AyI3t5MmCSohylAuC89_a9cBoMY9UkV",
        "filename": "desert_eagle_printstream.png"
    },
    {
        "name": "AK-47 | Slate",
        "type": "skins",
        "url": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwlcK3wiVI0POlPPNSMOKcCGKD0ud5vuBlcCW6khUz_W3Sytb4cCqTOFUpWJtzTOUD5hPsw9a0Yrnrs1SK3ooXzy6shilM5311o7FVYrIufmI",
        "filename": "ak47_slate.png"
    },
    {
        "name": "AWP | Atheris",
        "type": "skins",
        "url": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwiYbf_jdk7uW-V7JkMPWBMWuZxuZi_rZsS3zgzU8isW3dnIr6eHKfPVAhDpojEe9YsUW4xta1Nuzm5FDci4NbjXKpmWVQppo",
        "filename": "awp_atheris.png"
    },
    {
        "name": "AWP | Hyper Beast",
        "type": "skins",
        "url": "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwiYbf_jdk7uW-V6x0MPWBMWWVwP1ij-1gSCGn20pxtm_WzNuoeHKeaFAnCZUiTe5bt0HqxofmZOrm5Q2IjoMQzS_5iShXrnE8NzWs__c",
        "filename": "awp_hyper_beast.png"
    },

    # --- 25 VIDA REAL ---
    {
        "name": "Camiseta Oficial de España",
        "type": "real",
        "url": "https://images.unsplash.com/photo-1599839620453-df21fa88941e?w=500&auto=format&fit=crop&q=80",
        "filename": "camiseta_espana.jpg"
    },
    {
        "name": "PlayStation 5 Pro",
        "type": "real",
        "url": "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500&auto=format&fit=crop&q=80",
        "filename": "playstation_5_pro.jpg"
    },
    {
        "name": "iPhone 15 Pro Max",
        "type": "real",
        "url": "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=500&auto=format&fit=crop&q=80",
        "filename": "iphone_15_pro_max.jpg"
    },
    {
        "name": "Rolex Submariner Date",
        "type": "real",
        "url": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80",
        "filename": "rolex_submariner_date.jpg"
    },
    {
        "name": "Tesla Model 3",
        "type": "real",
        "url": "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=500&auto=format&fit=crop&q=80",
        "filename": "tesla_model_3.jpg"
    },
    {
        "name": "Menú Hamburguesa Completo",
        "type": "real",
        "url": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80",
        "filename": "hamburguesa_completa.jpg"
    },
    {
        "name": "Mansión de Lujo en Marbella",
        "type": "real",
        "url": "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=500&auto=format&fit=crop&q=80",
        "filename": "mansion_marbella.jpg"
    },
    {
        "name": "Patinete Eléctrico Premium",
        "type": "real",
        "url": "https://images.unsplash.com/photo-1597237154674-1a0d2274cef4?w=500&auto=format&fit=crop&q=80",
        "filename": "patinete_electrico.jpg"
    },
    {
        "name": "Billete de Metro Sencillo",
        "type": "real",
        "url": "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=500&auto=format&fit=crop&q=80",
        "filename": "billete_metro.jpg"
    },
    {
        "name": "Viaje a Japón Todo Incluido",
        "type": "real",
        "url": "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=500&auto=format&fit=crop&q=80",
        "filename": "viaje_japon.jpg"
    },
    {
        "name": "Isla Privada en las Bahamas",
        "type": "real",
        "url": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&auto=format&fit=crop&q=80",
        "filename": "isla_privada.jpg"
    },
    {
        "name": "Helicóptero Robinson R44",
        "type": "real",
        "url": "https://images.unsplash.com/photo-1579294800821-694d95e86143?w=500&auto=format&fit=crop&q=80",
        "filename": "helicoptero.jpg"
    },
    {
        "name": "Entradas VIP Final Champions",
        "type": "real",
        "url": "https://images.unsplash.com/photo-1540747737956-37872c76d1fd?w=500&auto=format&fit=crop&q=80",
        "filename": "entradas_champions.jpg"
    },
    {
        "name": "Refresco de Lata en el Cine",
        "type": "real",
        "url": "https://images.unsplash.com/photo-1534057308991-b9b3a578f1b1?w=500&auto=format&fit=crop&q=80",
        "filename": "refresco_cine.jpg"
    },
    {
        "name": "Lamborghini Huracán Evo",
        "type": "real",
        "url": "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=500&auto=format&fit=crop&q=80",
        "filename": "lamborghini_huracan.jpg"
    },
    {
        "name": "Cena Restaurante 3 Estrellas Michelin",
        "type": "real",
        "url": "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500&auto=format&fit=crop&q=80",
        "filename": "cena_michelin.jpg"
    },
    {
        "name": "Yate de Lujo (20 metros)",
        "type": "real",
        "url": "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=500&auto=format&fit=crop&q=80",
        "filename": "yate_lujo.jpg"
    },
    {
        "name": "Teclado Mecánico Custom Gamer",
        "type": "real",
        "url": "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=500&auto=format&fit=crop&q=80",
        "filename": "teclado_mecanico.jpg"
    },
    {
        "name": "Bolígrafo BIC Clásico",
        "type": "real",
        "url": "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=500&auto=format&fit=crop&q=80",
        "filename": "boligrafo_bic.jpg"
    },
    {
        "name": "MacBook Pro M3 Max",
        "type": "real",
        "url": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop&q=80",
        "filename": "macbook_pro.jpg"
    },
    {
        "name": "Suscripción 1 año Netflix Premium",
        "type": "real",
        "url": "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=500&auto=format&fit=crop&q=80",
        "filename": "netflix_premium.jpg"
    },
    {
        "name": "Bicicleta de Montaña Profesional",
        "type": "real",
        "url": "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=500&auto=format&fit=crop&q=80",
        "filename": "bicicleta_montana.jpg"
    },
    {
        "name": "Café Latte Grande en Cafetería",
        "type": "real",
        "url": "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=500&auto=format&fit=crop&q=80",
        "filename": "cafe_latte.jpg"
    },
    {
        "name": "Casa Adosada en Madrid",
        "type": "real",
        "url": "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=500&auto=format&fit=crop&q=80",
        "filename": "casa_adosada.jpg"
    },
    {
        "name": "Auriculares AirPods Pro",
        "type": "real",
        "url": "https://images.unsplash.com/photo-1588449668365-d15e397f6787?w=500&auto=format&fit=crop&q=80",
        "filename": "airpods_pro.jpg"
    }
]

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

print("Starting image download...")
for item in items:
    dest_dir = os.path.join("mas-caro", "images", item["type"])
    dest_path = os.path.join(dest_dir, item["filename"])
    
    if os.path.exists(dest_path) and os.path.getsize(dest_path) > 0:
        print(f"Skipping {item['name']}, already exists.")
        continue
        
    print(f"Downloading {item['name']} from {item['url']}...")
    try:
        req = urllib.request.Request(item["url"], headers=headers)
        with urllib.request.urlopen(req, timeout=15) as response:
            with open(dest_path, "wb") as f:
                f.write(response.read())
        print(f"Successfully downloaded {item['name']}")
        time.sleep(0.5) # Avoid rate limits
    except Exception as e:
        print(f"FAILED to download {item['name']}: {e}")

print("Download process completed.")
