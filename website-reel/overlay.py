from PIL import Image,ImageDraw,ImageFont
im=Image.new('RGBA',(720,1280));d=ImageDraw.Draw(im)
b='C:/Windows/Fonts/arialbd.ttf';r='C:/Windows/Fonts/arial.ttf'
d.rounded_rectangle((38,100,250,131),radius=2,fill='#a9d875');d.text((49,108),'NEW DIGITAL EXPERIENCE',font=ImageFont.truetype(b,13),fill='#10200e')
d.text((38,164),'Το νέο μας site.',font=ImageFont.truetype(b,50),fill='#f5faf3');d.text((38,226),'Μια εμπειρία σε κίνηση.',font=ImageFont.truetype(r,29),fill='#cce4c1')
d.rounded_rectangle((18,381,702,886),radius=8,outline='#b7dfac',width=3)
d.text((38,950),'Σχεδιασμός που ζωντανεύει.',font=ImageFont.truetype(b,27),fill='#f5faf3')
d.text((38,999),'Ανακάλυψε τη νέα μας ψηφιακή παρουσία.',font=ImageFont.truetype(r,21),fill='#cce4c1')
d.rounded_rectangle((38,1080,682,1158),radius=3,fill='#a9d875');d.text((67,1102),'digital.gtsystems.gr',font=ImageFont.truetype(b,32),fill='#11200f')
im.save('website-reel/overlay.png')
