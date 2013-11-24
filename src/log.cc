#include <iostream>
#include <stdio.h>
#include <string>

#include "GL/glew.h"
#include "SDL2/SDL.h"

#include "log.h"

Log::Log(const std::string &tag) : tag_(tag) {
}

void Log::Infof(const char* format, ...) const {
  va_list args;
  va_start(args, format);
  VLogf(format, args);
  va_end(args);
}

void Log::Errorf(const char* format, ...) const {
  va_list args;
  va_start(args, format);
  VLogf(format, args);
  va_end(args);
}

void Log::VLogf(const char* format, va_list args) const {
  fprintf(stderr, "%s: ", tag_.c_str());
  vfprintf(stderr, format, args);
  fprintf(stderr, "\n");
}

void Log::ErrorSDL(const char* message) const {
  fprintf(stderr, "%s: %s: %s\n", tag_.c_str(), message, SDL_GetError());
}

void Log::ErrorGLEW(const char* message, GLenum error) const {
  fprintf(stderr, "%s: %s: %s\n", tag_.c_str(), message, glewGetErrorString(error));
}
