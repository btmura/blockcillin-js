#include <fstream>
#include <iostream>
#include <sstream>
#include <string>

#include "GL/glew.h"
#include "SDL2/SDL.h"

#include "log.h"
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
    Log::ErrorSDL("SDL_Init");
    return false;
  }

  if (SDL_GL_SetAttribute(SDL_GL_CONTEXT_MAJOR_VERSION, 3) != 0) {
    Log::ErrorSDL("SDL_GL_SetAttribute");
    return false;
  }

  if (SDL_GL_SetAttribute(SDL_GL_CONTEXT_MINOR_VERSION, 1) != 0) {
    Log::ErrorSDL("SDL_GL_SetAttribute");
    return false;
  }

  if (SDL_GL_SetAttribute(SDL_GL_CONTEXT_PROFILE_MASK, SDL_GL_CONTEXT_PROFILE_CORE) != 0) {
    Log::ErrorSDL("SDL_GL_SetAttribute");
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
    Log::ErrorSDL("SDL_CreateWindow");
    return false;
  }

  return true;
}

bool GetFileContents(const std::string &path, std::string *contents) {
  std::ifstream in(path, std::ifstream::in);
  if (in.is_open()) {
    std::stringstream buffer;
    buffer << in.rdbuf();
    *contents = buffer.str();
    in.close();
    return true;
  }
  return false;
}

GLuint CreateShader(const GLenum type, const std::string &path) {
  GLuint shader = glCreateShader(type);
  if (shader == 0) {
    Log::ErrorGL("glCreateShader", shader);
    return 0;
  }

  std::string source;
  if (!GetFileContents(path, &source)) {
    Log::Error("GetFileContents");
    return 0;
  }

  const GLchar* sources[] = {source.c_str()};
  glShaderSource(shader, 1, sources, nullptr);
  glCompileShader(shader);

  GLint success = GL_TRUE;
  glGetShaderiv(shader, GL_COMPILE_STATUS, &success);
  if (success != GL_TRUE) {
    Log::Error("compiling shader failed");
    return 0;
  }

  return shader;
}

bool Game::InitGL() {
  SDL_GLContext context = SDL_GL_CreateContext(window_);
  if (context == nullptr) {
    Log::ErrorSDL("SDL_GL_CreateContext");
    return false;
  }

  GLenum error = glewInit();
  if (error != GLEW_OK) {
    Log::ErrorGLEW("glewInit", error);
    return false;
  }

  program_ = glCreateProgram();
  if (program_ == 0) {
    Log::ErrorGL("glCreateProgram", program_);
    return false;
  }

  GLuint vertex_shader = CreateShader(GL_VERTEX_SHADER, "data/vertex-shader.txt");
  if (vertex_shader == 0) {
    Log::Error("error creating vertex shader");
    return false;
  }

  GLuint fragment_shader = CreateShader(GL_FRAGMENT_SHADER, "data/fragment-shader.txt");
  if (fragment_shader == 0) {
    Log::Error("error creating fragment shader");
    return false;
  }

  glAttachShader(program_, vertex_shader);
  glAttachShader(program_, fragment_shader);
  glLinkProgram(program_);

  GLint success = GL_TRUE;
  glGetProgramiv(program_, GL_LINK_STATUS, &success);
  if (success != GL_TRUE) {
    Log::Error("error linking program");
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
