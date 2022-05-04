# Hello world javascript action

This action prints "Hello World" or "Hello" + the name of a person to greet to the log.

## 環境
```zsh
node -v
v16.15.0

npm -v
8.5.5
```


## Inputs

## `who-to-greet`

**Required** The name of the person to greet. デフォルトは `"World"`。

## Outputs

## `time`

The time we greeted you.

## 使用例

uses: actions/hello-world-javascript-action@v1.1
with:
  who-to-greet: 'Mona the Octocat



### build and release

```zsh
ncc build index.js --license licenses.txt
git tag -a -m "" v1.1
git push --follow-tags
```



## 参考
- https://docs.github.com/ja/actions/creating-actions/creating-a-javascript-action
