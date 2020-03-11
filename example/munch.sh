echo "=== Test 1 ==="
muncher --input sprites/square --output output/foreground
echo "=== Test 2 ==="
muncher --input sprites --output output/spritesheet --flip
echo "=== No input ==="
echo ""
muncher --output output/foreground --flip
echo ""
echo "=== No output ==="
echo ""
muncher --input sprites/square --flip
echo ""
echo "=== Directory not found ==="
echo ""
muncher --input unknown --output output/foreground --flip
echo ""
echo "=== Texture packer error ==="
echo ""
muncher --input sprites-big --output output/foreground --flip
echo ""
