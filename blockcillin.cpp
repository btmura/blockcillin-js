#include <iostream>

#include "SDL/SDL.h"

using namespace std;

int main(int argc, char *argv[]) {
	if (SDL_Init(SDL_INIT_EVERYTHING) != 0) {
		cerr << "SDL_Init failed: " << SDL_GetError() << endl;
		return 1;
	}

	cout << "blockcillin" << endl;

	SDL_Quit();
	return 0;
}
