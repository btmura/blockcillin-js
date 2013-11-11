#include <iostream>

#include "GL/glew.h"
#include "SDL2/SDL.h"

#include "game.h"

const std::string kWindowTitle = "blockcillin";
const int kWindowX = SDL_WINDOWPOS_UNDEFINED;
const int kWindowY = SDL_WINDOWPOS_UNDEFINED;
const int kWindowWidth = 640;
const int kWindowHeight = 480;
const int kWindowFlags = SDL_WINDOW_OPENGL;

int Game::Run() {
  if (!InitWindow()) {
    return 1;
  }

  if (!InitGL()) {
    return 1;
  }

  Loop();
  Quit();
  return 0;
}

bool Game::InitWindow() {
  if (SDL_Init(SDL_INIT_EVERYTHING) != 0) {
    LogSDLError("SDL_Init");
    return false;
  }

  if (SDL_GL_SetAttribute(SDL_GL_CONTEXT_MAJOR_VERSION, 3) != 0) {
    LogSDLError("SDL_GL_SetAttribute");
    return false;
  }

  if (SDL_GL_SetAttribute(SDL_GL_CONTEXT_MINOR_VERSION, 1) != 0) {
    LogSDLError("SDL_GL_SetAttribute");
    return false;
  }

  if (SDL_GL_SetAttribute(SDL_GL_CONTEXT_PROFILE_MASK, SDL_GL_CONTEXT_PROFILE_CORE) != 0) {
    LogSDLError("SDL_GL_SetAttribute");
    return false;
  }

  window_ = SDL_CreateWindow(
    kWindowTitle.c_str(),
    kWindowX,
    kWindowY,
    kWindowWidth,
    kWindowHeight,
    kWindowFlags);
  if (window_ == NULL) {
    LogSDLError("SDL_CreateWindow");
    return false;
  }

  return true;
}

bool Game::InitGL() {
  SDL_GLContext context = SDL_GL_CreateContext(window_);
  if (context == NULL) {
    LogSDLError("SDL_GL_CreateContext");
    return false;
  }

  GLenum error = glewInit();
  if (error != GLEW_OK) {
    LogGLEWError("glewInit", error);
    return false;
  }

  program_ = glCreateProgram();
  if (program_ == 0) {
    LogGLError("glCreateProgram", program_);
    return false;
  }

  GLuint vertex_shader = glCreateShader(GL_VERTEX_SHADER);
  if (vertex_shader == 0) {
    LogGLError("glCreateShader", vertex_shader);
    return false;
  }

  return true;
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

    Render();
    SDL_GL_SwapWindow(window_);
  }
}

void Game::Render() {
  glClear(GL_COLOR_BUFFER_BIT);
}

void Game::Quit() {
  glDeleteProgram(program_);
  SDL_DestroyWindow(window_);
  SDL_Quit();
}

void Game::LogSDLError(const std::string &tag) {
  std::cerr << tag << " error: " << SDL_GetError() << std::endl;
}

void Game::LogGLEWError(const std::string &tag, GLenum error) {
  std::cerr << tag << " error: " << glewGetErrorString(error) << std::endl;
}

void Game::LogGLError(const std::string &tag, GLuint error) {
  std::cerr << tag << " error: " << error << std::endl;
}