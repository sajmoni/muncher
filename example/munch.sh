echo ""
echo "=== Test 1 ==="
muncher --input sprites/square --output output/foreground
echo "=== Test 2 ==="
muncher --input sprites --output output/spritesheet --flip
echo "=== No flip ==="
muncher --input sprites --output output/noFlip
echo "=== Texture packer options ==="
muncher --input sprites --output output/withTexturePackerOptions --extrude 5
echo "=== Config file ==="
muncher --config muncher.json
echo "=== No input ==="
echo ""
muncher --output output/foreground --flip
echo ""
echo "=== No output ==="
echo ""
muncher --input sprites/square --flip
echo ""
echo "=== Directory not found ==="
muncher --input unknown --output output/foreground --flip
echo "=== Texture packer error ==="
echo ""
muncher --input sprites-big --output output/foreground --flip
echo ""
