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

#ifndef BLOCKCILLIN_LOG_H_
#define BLOCKCILLIN_LOG_H_

#include <stdio.h>
#include <string>
#include "GL/glew.h"

class Log {
 public:
  Log(const std::string &tag);
  void Infof(const char* format, ...) const;
  void Errorf(const char* format, ...) const;
  void ErrorSDL(const char* message) const;
  void ErrorGLEW(const char* message, const GLenum error) const;

 private:
  void VLogf(const char* format, va_list args) const;

  const std::string tag_;
};

#endif // BLOCKCILLIN_LOG_H_
