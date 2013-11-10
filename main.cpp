#include <iostream>
#include "SDL2/SDL.h"

const std::string WindowTitle = "blockcillin";
const int WindowX = SDL_WINDOWPOS_UNDEFINED;
const int WindowY = SDL_WINDOWPOS_UNDEFINED;
const int WindowWidth = 640;
const int WindowHeight = 480;
const int WindowFlags = SDL_WINDOW_OPENGL;

int main(int argc, char *argv[]) {
	if (SDL_Init(SDL_INIT_EVERYTHING) != 0) {
		std::cerr << "SDL_Init failed: " << SDL_GetError() << std::endl;
		return 1;
	}

	SDL_Window *window = SDL_CreateWindow(
		WindowTitle.c_str(),
		WindowX,
		WindowY,
		WindowWidth,
		WindowHeight,
		WindowFlags);
	if (window == NULL) {
		std::cerr << "SDL_CreateWindow failed: " << SDL_GetError() << std::endl;
		return 1;
	}

	SDL_Delay(5000);

	SDL_DestroyWindow(window);

	SDL_Quit();
	return 0;
}
