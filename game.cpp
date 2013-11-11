#include <iostream>
#include "SDL2/SDL.h"
#include "GL/glew.h"
#include "game.h"

const std::string kWindowTitle = "blockcillin";
const int kWindowX = SDL_WINDOWPOS_UNDEFINED;
const int kWindowY = SDL_WINDOWPOS_UNDEFINED;
const int kWindowWidth = 640;
const int kWindowHeight = 480;
const int kWindowFlags = SDL_WINDOW_OPENGL;

void Game::Run() {
  if (Init() == 0) {
    Loop();
    Quit();
  }
}

int Game::Init() {
  if (SDL_Init(SDL_INIT_EVERYTHING) != 0) {
    LogSDLError("SDL_Init");
    return 1;
  }

  if (SDL_GL_SetAttribute(SDL_GL_CONTEXT_MAJOR_VERSION, 3) != 0) {
    LogSDLError("SDL_GL_SetAttribute");
    return 1;
  }

  if (SDL_GL_SetAttribute(SDL_GL_CONTEXT_MINOR_VERSION, 1) != 0) {
    LogSDLError("SDL_GL_SetAttribute");
    return 1;
  }

  if (SDL_GL_SetAttribute(SDL_GL_CONTEXT_PROFILE_MASK, SDL_GL_CONTEXT_PROFILE_CORE) != 0) {
    LogSDLError("SDL_GL_SetAttribute");
    return 1;
  }

  window = SDL_CreateWindow(
    kWindowTitle.c_str(),
    kWindowX,
    kWindowY,
    kWindowWidth,
    kWindowHeight,
    kWindowFlags);
  if (window == NULL) {
    LogSDLError("SDL_CreateWindow");
    return 1;
  }

  SDL_GLContext context = SDL_GL_CreateContext(window);
  if (context == NULL) {
    LogSDLError("SDL_GL_CreateContext");
    return 1;
  }

  return 0;
}

void Game::Loop() {
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

    glClearColor(1, 0, 0, 1);
    glClear(GL_COLOR_BUFFER_BIT);
    SDL_GL_SwapWindow(window);
  }
}

void Game::Quit() {
  SDL_DestroyWindow(window);
  SDL_Quit();
}

void Game::LogSDLError(const std::string &message) {
  std::cerr << message << " error: " << SDL_GetError() << std::endl;
}
