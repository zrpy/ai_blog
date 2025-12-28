---
title: Pythonで使える gofile.io ラッパー「gofile.py」
tags: scrape, scraping, gofile, python, wrapper
---
# Pythonで使える gofile.io ラッパー「gofile.py」

[gofile.io](https://gofile.io) を Python から扱えるラッパーライブラリ、「gofile.py」をご紹介します。

## 概要

「gofile.py」は、ファイル共有サービス gofile.io の API を Python 上で簡単に扱うためのラッパーです。同期／非同期クライアントに対応しており、ファイルのアップロードやダウンロードをスムーズに行うことができます。

## 主な機能

* 同期クライアント（`GofileSyncClient`）の提供
* 非同期クライアント（`GofileAsyncClient`）の提供
* `register()` メソッドでアカウント登録（トークン取得）
* `login()` メソッドでログイン機能
* `get_info()` によるフォルダ／ファイルのリンク取得
* `download()` によるファイルのダウンロード操作対応
* `upload()` によるファイルアップロード
* `update()` でファイル情報（名前、説明、タグなど）の更新
* `delete_content()` でファイル削除

## サンプルコード

### 同期版

```python
import GoFile, os

# クライアントの生成
client = GoFile.GofileSyncClient()

# アカウント登録（トークン取得）
print(client.register())

# 必要に応じてログイン
# client.login("YOUR_TOKEN")

# ファイル／フォルダ情報を取得
link = client.get_info("code","password")  # "code" は対象フォルダのコード

# ファイルを順番にダウンロード
for key in link["children"]:
    client.download(link["children"][key]["link"], os.getcwd())

# ファイルをアップロード
client.upload(os.path.join(os.getcwd(), "example.txt"), folder_id="")

# ファイル情報を更新
client.update("ContentID", "name", "new_name.txt")

# ファイルを削除
client.delete_content("ContentID")
```

### 非同期版

```python
import asyncio
import GoFile, os

async def main():
    client = GoFile.GofileAsyncClient()
    print(await client.register())

    link = await client.get_info("code","password")
    for key in link["children"]:
        await client.download(link["children"][key]["link"], os.getcwd())

    await client.upload(os.path.join(os.getcwd(), "example.txt"), folder_id="")
    await client.update("ContentID", "name", "new_name.txt")
    await client.delete_content("ContentID")

asyncio.run(main())
```

## まとめ

「gofile.py」を使えば、Pythonから簡単に gofile.io のファイル操作が可能です。同期／非同期両方のクライアントが揃っているので、用途に応じて使い分けられます。ファイル共有やバックアップ、自動アップロードスクリプトなど、さまざまな用途で活用できます。
