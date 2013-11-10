#include <iostream>
#include "SDL2/SDL.h"

const std::string kWindowTitle = "blockcillin";
const int kWindowX = SDL_WINDOWPOS_UNDEFINED;
const int kWindowY = SDL_WINDOWPOS_UNDEFINED;
const int kWindowWidth = 640;
const int kWindowHeight = 480;
const int kWindowFlags = SDL_WINDOW_OPENGL;

void logSDLError(const std::string &message) {
	std::cerr << message << " error: " << SDL_GetError() << std::endl;
}

int main(int argc, char *argv[]) {
	if (SDL_Init(SDL_INIT_EVERYTHING) != 0) {
		logSDLError("SDL_Init");
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
		logSDLError("SDL_CreateWindow");
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
