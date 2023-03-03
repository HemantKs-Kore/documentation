# Optimizing images

```
npm run compressImage
```

Output will look like this...

```javascript
PS E:\projects\Findly\findly-builder> npm run compressImage

> findly-builder@0.0.0 compressImage
> node tools/scripts/compress-image.js

-----------------------------------
 File from: apps/searchassist/src/assets-source/icons/landing/cat.png
 File to: apps/searchassist/src/assets/icons/landing/cat.png
 Compression algorithm: [pngquant]
 Original size: [34.18KB] | Compressed size: [31.79KB] | Compression rate: [6.97%]
-----------------------------------
-------------
null
true
{
  input: 'apps/searchassist/src/assets-source/icons/landing/cat.png',
  path_out_new: 'apps/searchassist/src/assets/icons/landing/cat.png',
  algorithm: 'pngquant',
  size_in: 34996,
  size_output: 32558,
  percent: 6.97,
  err: null
}
-------------
PS E:\projects\Findly\findly-builder>
```

If all images optimized you may get this....

```js
PS E:\projects\Findly\findly-builder> npm run compressImage

> findly-builder@0.0.0 compressImage
> node tools/scripts/compress-image.js

-------------
null
true
undefined
-------------
PS E:\projects\Findly\findly-builder>
```

**Note**

You want to place any new image inside `images-source` folder maintaining same folder structure.

## Dirty trick ( if you Don't want to create deep folder structure)

Place all new images in a folder inside `images-source` run `npm run compressImage` it will generate optimized images now you want to manually copy paste images in intended folder, Don't forget to remove new folder you created inside `images-source` directory.
