#include <fstream>
#include <iostream>
#include <sstream>
#include <string>

#include "GL/glew.h"
#include "SDL2/SDL.h"

#include "file.h"
#include "game.h"
#include "log.h"

const std::string kTag = "game";

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
    Log::ErrorSDL("SDL_Init");
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

GLuint CreateShader(const GLenum type, const std::string &path) {
  GLuint shader = glCreateShader(type);
  if (shader == 0) {
    Log::ErrorGL("glCreateShader", shader);
    return 0;
  }

  std::string source;
  if (!File::GetFileContents(path, &source)) {
    Log::Error(kTag, "GetFileContents");
    return 0;
  }

  const GLchar* sources[] = {source.c_str()};
  glShaderSource(shader, 1, sources, nullptr);
  glCompileShader(shader);

  GLint success = GL_TRUE;
  glGetShaderiv(shader, GL_COMPILE_STATUS, &success);
  if (success != GL_TRUE) {
    GLint info_log_length;
    glGetShaderiv(shader, GL_INFO_LOG_LENGTH, &info_log_length);

    GLchar *info_log = new GLchar[info_log_length];
    glGetShaderInfoLog(shader, info_log_length, nullptr, info_log);

    std::cerr << "error: " << type << " -> " << info_log << std::endl;
    delete[] info_log;
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

  const GLubyte* gl_version = glGetString(GL_VERSION);
  log.Info("GL_VERSION: %s", gl_version);

  const GLubyte* glsl_version = glGetString(GL_SHADING_LANGUAGE_VERSION);
  log.Info("GL_SHADING_LANGUAGE_VERSION: %s", glsl_version);

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
    Log::Error(kTag, "error creating vertex shader");
    return false;
  }

  GLuint fragment_shader = CreateShader(GL_FRAGMENT_SHADER, "data/fragment-shader.txt");
  if (fragment_shader == 0) {
    Log::Error(kTag, "error creating fragment shader");
    return false;
  }

  glAttachShader(program_, vertex_shader);
  glAttachShader(program_, fragment_shader);
  glLinkProgram(program_);

  GLint success = GL_TRUE;
  glGetProgramiv(program_, GL_LINK_STATUS, &success);
  if (success != GL_TRUE) {
    Log::Error(kTag, "error linking program");
    return false;
  }

  glDeleteShader(vertex_shader);
  glDeleteShader(fragment_shader);

  position_ = glGetAttribLocation(program_, "position");
  if (position_ == -1) {
    Log::Error(kTag, "glGetAttribLocation");
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
