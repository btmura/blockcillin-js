#include <fstream>
#include <iostream>
#include <sstream>
#include <string>

#include "GL/glew.h"
#include "SDL2/SDL.h"

#include "game.h"
#include "glutil.h"
#include "log.h"

const std::string kWindowTitle = "blockcillin";
const int kWindowX = SDL_WINDOWPOS_UNDEFINED;
const int kWindowY = SDL_WINDOWPOS_UNDEFINED;
const int kWindowWidth = 1024;
const int kWindowHeight = 768;
const int kWindowFlags = SDL_WINDOW_OPENGL;

const Log Game::log("game");

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
    log.ErrorSDL("SDL_Init");
    return false;
  }

  window_ = SDL_CreateWindow(
      kWindowTitle.c_str(),
      kWindowX,
      kWindowY,
      kWindowWidth,
      kWindowHeight,
      kWindowFlags);
  if (window_ == nullptr) {
    log.ErrorSDL("SDL_CreateWindow");
    return false;
  }

  return true;
}

bool Game::InitGL() {
  SDL_GLContext context = SDL_GL_CreateContext(window_);
  if (context == nullptr) {
    log.ErrorSDL("SDL_GL_CreateContext");
    return false;
  }

  const GLubyte* gl_version = glGetString(GL_VERSION);
  log.Infof("GL_VERSION: %s", gl_version);

  const GLubyte* glsl_version = glGetString(GL_SHADING_LANGUAGE_VERSION);
  log.Infof("GL_SHADING_LANGUAGE_VERSION: %s", glsl_version);

  GLenum error = glewInit();
  if (error != GLEW_OK) {
    log.ErrorGLEW("glewInit", error);
    return false;
  }

  program_ = GLUtil::CreateProgram("data/vertex-shader.txt", "data/fragment-shader.txt");
  if (program_ == 0) {
    log.Errorf("CreateProgram failed");
    return false;
  }

  position_ = glGetAttribLocation(program_, "position");
  if (position_ == -1) {
    log.Errorf("glGetAttribLocation failed");
    return false;
  }

  const GLfloat vertex_data[] = {
    -0.5f, -0.5f,
    0.5f, -0.5f,
    0.5f,  0.5f,
    -0.5f,  0.5f
  };

  const GLuint index_data[] = {0, 1, 2, 3};

  glGenBuffers(1, &vbo_);
  glBindBuffer(GL_ARRAY_BUFFER, vbo_);
  glBufferData(GL_ARRAY_BUFFER, sizeof(vertex_data), vertex_data, GL_STATIC_DRAW);

  glGenBuffers(1, &ibo_);
  glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, ibo_);
  glBufferData(GL_ELEMENT_ARRAY_BUFFER, sizeof(index_data), index_data, GL_STATIC_DRAW);

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
  glClearColor(0.0f, 0.0f, 0.0f, 1.0f);
  glClear(GL_COLOR_BUFFER_BIT);

  glUseProgram(program_);

  glEnableVertexAttribArray(position_);

  glBindBuffer(GL_ARRAY_BUFFER, vbo_);
  glVertexAttribPointer(position_, 2, GL_FLOAT, GL_FALSE, 0, nullptr);

  glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, ibo_);
  glDrawElements(GL_TRIANGLE_FAN, 4, GL_UNSIGNED_INT, nullptr);

  glDisableVertexAttribArray(position_);

  glUseProgram(0);
}

void Game::Quit() {
  glDeleteProgram(program_);
  SDL_DestroyWindow(window_);
  SDL_Quit();
}
