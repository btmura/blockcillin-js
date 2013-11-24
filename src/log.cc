#include <iostream>
#include <stdio.h>
#include <string>

#include "GL/glew.h"
#include "SDL2/SDL.h"

#include "log.h"

void log(const std::string &tag, const char* format, va_list args) {
  fprintf(stderr, "%s: ", tag.c_str());
  vfprintf(stderr, format, args);
  fprintf(stderr, "\n");
}

void Log::Info(const std::string &tag, const char* format, ...) {
  va_list args;
  va_start(args, format);
  log(tag, format, args);
  va_end(args);
}

void Log::Error(const std::string &tag, const char* format, ...) {
  va_list args;
  va_start(args, format);
  log(tag, format, args);
  va_end(args);
}

void Log::ErrorSDL(const std::string &tag) {
  std::cerr << tag << " error: " << SDL_GetError() << std::endl;
}

void Log::ErrorGLEW(const std::string &tag, GLenum error) {
  std::cerr << tag << " error: " << glewGetErrorString(error) << std::endl;
}

void Log::ErrorGL(const std::string &tag, GLuint error) {
  std::cerr << tag << " error: " << error << std::endl;
}
