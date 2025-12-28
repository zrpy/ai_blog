---
title: Discordのチャンネルのログを消し去る方法
tags: scrape, scraping, antibot, anti-bot, purge, clean, clear, discord
---
# Discordチャンネルを簡単にリセットできるPythonボット「discordchannelresetter-py」

Discordサーバーのチャンネルを簡単にリセットできるPython製ボット、「[discordchannelresetter-py](https://github.com/zrpy/discordchannelresetter-py)」を紹介します。

こらっ!違法なことに使っちゃだめでしょ!（白目）

## 概要

このボットは、指定したDiscordサーバー内のテキストチャンネルやボイスチャンネルを削除・再作成することで、チャンネルの内容をリセットすることができます。手動でチャンネルを作り直す手間が省けるので、イベント用サーバーやテスト用サーバーの運用に便利です。

## 主な機能

* チャンネルの一括削除と再作成
* テキストチャンネル・ボイスチャンネル両対応
* Python で簡単にカスタマイズ可能

## 動作環境

* Python 3.9 以上
* `discord.py` ライブラリ
* `pytz` ライブラリ

必要なライブラリは以下のコマンドでインストール可能です。

```bash
pip install discord.py pytz
```

## 設定方法

1. GitHub リポジトリからコードをクローン
2. Discord Developer Portal でボットを作成し、トークンを取得
3. `main.py` 内の `TOKEN` を自分のボットのトークンに置き換え
4. 必要に応じてチャンネル名やカテゴリ名を設定
5. Python スクリプトを実行

```bash
python main.py
```

## 注意点

* チャンネルの削除はサーバー管理者権限が必要です
* 一度削除すると元に戻せないため、実行前に必ずバックアップを取ることをおすすめします
* テスト環境で動作確認してから本番サーバーで利用してください

## まとめ

「discordchannelresetter-py」は、Discordサーバーのチャンネル管理を効率化する便利なツールです。イベント前やテスト環境でのサーバーリセット作業を自動化したい方におすすめです。

GitHub リポジトリはこちら： [discordchannelresetter-py](https://github.com/zrpy/discordchannelresetter-py)
