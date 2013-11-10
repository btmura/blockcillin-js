#include <iostream>
#include "SDL2/SDL.h"

const std::string kWindowTitle = "blockcillin";
const int kWindowX = SDL_WINDOWPOS_UNDEFINED;
const int kWindowY = SDL_WINDOWPOS_UNDEFINED;
const int kWindowWidth = 640;
const int kWindowHeight = 480;
const int kWindowFlags = SDL_WINDOW_OPENGL;

int main(int argc, char *argv[]) {
	if (SDL_Init(SDL_INIT_EVERYTHING) != 0) {
		std::cerr << "SDL_Init failed: " << SDL_GetError() << std::endl;
		return 1;
	}

	SDL_Window *window = SDL_CreateWindow(
		kWindowTitle.c_str(),
		kWindowX,
		kWindowY,
		kWindowWidth,
		kWindowHeight,
		kWindowFlags);
	if (window == NULL) {
		std::cerr << "SDL_CreateWindow failed: " << SDL_GetError() << std::endl;
		return 1;
	}

	SDL_Surface *surface = SDL_GetWindowSurface(window);
	SDL_Event event;
	bool quit = false;

	while (!quit) {
		while (SDL_PollEvent(&event) != 0) {
			switch (event.type) {
				case SDL_QUIT:
					quit = true;
					break;
			}
		}
		SDL_FillRect(surface, NULL, SDL_MapRGB(surface->format, 0xFF, 0, 0));
		SDL_UpdateWindowSurface(window);
	}

	SDL_DestroyWindow(window);
	SDL_Quit();
	return 0;
}
