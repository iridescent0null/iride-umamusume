import sys
from pytesseract import pytesseract

print("started...")

# input the file name
image = "your_image.jpeg" 

str = pytesseract.image_to_string(image, lang="jpn", config="--oem 1 --psm 6 -c preserve_interword_spaces=1")
print("\n%s" % str)