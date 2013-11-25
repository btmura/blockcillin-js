#ifndef BLOCKCILLIN_GL_UTIL_H_
#define BLOCKCILLIN_GL_UTIL_H_

#include "log.h"

class GLUtil {
 public:
  static GLuint CreateProgram(
      const std::string &vertex_shader_path,
      const std::string &fragment_shader_path);

 private:
  static GLuint CreateShader(const GLenum type, const std::string &path);

  static const Log log;
};

#endif // BLOCKCILLIN_GL_UTIL_H_
