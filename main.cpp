#include <iostream>
#include "SDL/SDL.h"

int main(int argc, char *argv[]) {
	if (SDL_Init(SDL_INIT_EVERYTHING) != 0) {
		std::cerr << "SDL_Init failed: " << SDL_GetError() << std::endl;
		return 1;
	}

	std::cout << "blockcillin" << std::endl;

	SDL_Quit();
	return 0;
}
