---
title: 中品質なdiscord認証bot
tags: discord, bot, verify, auth, oauth2
---
# Web上で簡単に操作できる認証BOT「改札」

Discordで簡単に認証パネルを設置できるBot、「[改札](https://zrpyverify.vercel.app/)」を紹介します。

## 概要

このボットは、指定したDiscordサーバー内のテキストチャンネルに認証パネルを設置し、Botなどの侵入を防ぐことができます。

手動で認証する手間が省けるため、イベント用サーバーや大規模サーバーでの運用に便利です。

## 主な機能
* ユーザーの再呼び出し機能。(悪用厳禁)
* Botの認証阻害(Proxy,Vpn)
* ほぼパスワード認証

## 動作環境

* WebEngineを使用できる
* Discordが使用できる
* Proxy,VPNを使っていない。(IPは保存されません)

## 設定方法

1. サーバーIDを[このサイト](https://zrpyverify.vercel.app/auth/register)で入力しBOTを加入させ登録する。
2. [ここから認証パネルを送信する](https://zrpyverify.vercel.app/auth/panel) ※[ここからパネルを削除できます](https://zrpyverify.vercel.app/auth/panel/delete)
3. [ここからメンバーを呼び戻す](https://zrpyverify.vercel.app/auth/backup)
5. サーバーの契約を打ち切り、データを完全に削除する場合は[ここから]([https://zrpyverify.vercel.app/auth/backup](https://zrpyverify.vercel.app/auth/delete_data))

## 注意点

* VPNやProxyは使用ができません。
* 一度削除すると元に戻せないため、実行前に必ず管理者内での話し合いを行いましょう
* テスト環境で動作確認してから本番サーバーで利用してください。責任はとれません。
* 動作の保証はできません
* いかなるトラブルも対応しません。
* Botが起動(オンライン)している場合は乗っ取りか有事の際です。

## まとめ

「改札」は、Discordサーバーのメンバー管理を効率化する便利なBOTです。

サーバーでの管理をある程度自動化させたい人におすすめです。

常時BOTは起動していないので安心です。

Webでの操作のためめんどくさい処理はなし。

開発者のプロフィールはこちら： [Zrpy](https://aynm.dev/zrpy)
