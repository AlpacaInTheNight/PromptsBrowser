import os
from PIL import Image
from modules.shared import opts

def resize_image(imgSrc):
    if not imgSrc: return

    allow_resize = True
    if hasattr(opts, "pbe_resize_thumbnails"): allow_resize = opts.pbe_resize_thumbnails
    if not allow_resize: return

    max_width = 300
    max_height = 300
    extension = "jpg"
    clean_old_file = False

    if hasattr(opts, "pbe_resize_thumbnails_max_width"): max_width = opts.pbe_resize_thumbnails_max_width
    if hasattr(opts, "pbe_resize_thumbnails_max_height"): max_height = opts.pbe_resize_thumbnails_max_height
    if hasattr(opts, "pbe_resize_thumbnails_format") and opts.pbe_resize_thumbnails_format == "PNG": extension = "png"

    img = Image.open(imgSrc)

    img_width = img.size[0]
    img_height = img.size[1]

    if img_width > max_width or img_height > max_height:
        if img_width >= img_height:
            img_height = int( float(img.size[1]) * float(max_width / float(img.size[0])) )
            img_width = max_width
        else:
            img_width = int( float(img.size[0]) * float(max_height / float(img.size[1])) )
            img_height = max_height

        img = img.resize((img_width, img_height), Image.Resampling.LANCZOS)
        
        file_name = os.path.splitext(imgSrc)[0]
        old_extension = os.path.splitext(imgSrc)[1]

        if(old_extension != extension): os.remove(imgSrc)

        img.save(file_name + "." + extension)
    
    img.close()
