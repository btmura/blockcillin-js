/*
 * Copyright (C) 2013 Brian Muramatsu
 *
 * This file is part of blockcillin.
 *
 * blockcillin is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * blockcillin is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with blockcillin.  If not, see <http://www.gnu.org/licenses/>.
 */

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
